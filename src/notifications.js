import firebase from 'firebase';
import logo from './assets/village.png';

const notifications = {
  notifyOnMount() {
    new Notification("I am a notification.")
  },
  notifyOnThreadChange(channelID) {
    firebase
      .firestore()
      .collection('channels')
      .doc(channelID)
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
