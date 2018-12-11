import { when } from 'mobx';
import { Contact } from 'peerio-icebear/dist/models';

export async function waitForContactLoaded(contact: Contact): Promise<Contact> {
    return new Promise<Contact>(resolve => when(() => !contact.loading, () => resolve(contact)));
}
