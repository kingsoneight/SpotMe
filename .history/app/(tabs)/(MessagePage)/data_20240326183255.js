
import { firestore } from '../../../firebaseConfig';

import { getFirestore, collection, query, orderBy, limit, onSnapshot, serverTimestamp, addDoc } from 'firebase/firestore';

class Fire {

  constructor() {

    this.db = firestore;
  }
  // 1.
  get ref() {
    return collection(this.db, 'messages');
  }
  // 2.
  on = callback => {
    const q = query(this.ref, orderBy('timestamp', 'desc'), limit(20)); // Create a query

    this.unsubscribe = onSnapshot(q, snapshot => {
      snapshot.docChanges().forEach(change => {
        console.log("I'm before");
        if (change.type === 'added') {
          console.log("I'm middle");
          callback(this.parse(change.doc));
          console.log("I'm after");
        }
      });
    });
  }
  // 3.
  parse = document => {
    const data = document.data();
    const _id = document.id;
    console.log(data.timestamp);
    const timestamp = data.timestamp ? data.timestamp.toDate() : new Date(); // Fallback to client-side timestamp

    const { text, user } = data;

    const message = {
      _id,
      timestamp,
      text,
      user
    };
    return message;
  };

  // 4.
  off() {
    if (this.unsubscribe) this.unsubscribe();
  }


  // Send messages
  get timestamp() {
    return serverTimestamp();
  }


  send = (messages, userId) => {
    for (let i = 0; i < messages.length; i++) {
      const { text } = messages[i];

      const message = {
        text,
        user: { _id: userId },
        timestamp: this.timestamp,
      };
      this.append(message);
    }
  };


  append = async message => {
    try {
      const docRef = await addDoc(this.ref, message);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
}

Fire.shared = new Fire();

export default Fire;