import { useStorage } from "@vueuse/core";

export type Contact = {
  name: string;
  address: string;
};

export const useContactsStore = defineStore("contacts", () => {
  const { account } = storeToRefs(useOnboardStore());
  const storageContacts = useStorage<{ [userAddress: string]: Contact[] }>("contacts", {});

  const userContacts = computed<Contact[]>({
    get: () => {
      if (account.value.address && Array.isArray(storageContacts.value[account.value.address])) {
        return [...storageContacts.value[account.value.address]].sort((a, b) => a.name.localeCompare(b.name));
      }
      return [];
    },
    set: (contacts: Contact[]) => {
      if (!account.value.address) {
        throw new Error("Account is not available");
      }
      storageContacts.value[account.value.address] = contacts;
    },
  });

  const userContactsByFirstCharacter = computed(() => {
    const contacts: { [firstCharacter: string]: Contact[] } = {};
    for (const contact of userContacts.value) {
      const firstCharacter = contact.name.slice(0, 1).toUpperCase();
      if (!contacts[firstCharacter]) {
        contacts[firstCharacter] = [];
      }
      contacts[firstCharacter].push(contact);
    }
    return contacts;
  });

  const saveContact = (contact: Contact) => {
    if (contact.address === account.value.address) {
      throw new Error("Can't add own account to contacts");
    }
    removeContact(contact.address);
    userContacts.value = [...userContacts.value, contact];
  };
  const removeContact = (contactAddress: string) => {
    const contactIndex = userContacts.value.map((e) => e.address).indexOf(contactAddress);
    if (contactIndex !== -1) {
      const newContacts = [...userContacts.value];
      newContacts.splice(contactIndex, 1);
      userContacts.value = newContacts;
    }
  };

  return {
    userContacts,
    userContactsByFirstCharacter,
    saveContact,
    removeContact,
  };
});
