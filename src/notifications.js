import firebase from 'firebase';
import logo from './assets/village.png';

const notifications = {
  notifyOnMount() {
    new Notification("I am a notification.")
  },
  notifyOnThreadChange() {
    firebase
      .firestore()
      .collection('channels')
      .doc('BT7tiOsM7jtXblyAx4rB')
      .onSnapshot(channelUpdate => {
        const thread = channelUpdate.data().thread;

        const mostRecent = thread[thread.length - 1];

        const sender = mostRecent.senderName;

        const content = mostRecent.content;

        new Notification(sender, {
          icon: logo,
          body: content
        });
      });
  }
}

export default notifications;
