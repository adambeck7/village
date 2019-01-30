// determine all permissions handling for easy implementation on the frontend.
// removed channelID parameter owing to a new data-saving idea: if there is an administrator on the channel, they can elect to have permissions for each comment sent to them. Although now that I'm writing this I'm seeing the flaw in it being that there are n types of admin privileges, not just one. 

// THE LEDGER QUESTION: should the ledger be immutable or mutable? Need to think about this. 

// Imports
import firebase from 'firebase';

const permissions = {
  // SPECS: takes OBJ Message, Members[], optional STR admin returns new channel ID;
  // FOR: Creating a new channel with options defined in channelPayloadOptions array below. 
  openChannel(params) {

    // define a couple potential payloads for the firebase add. 
    const channelPayloadOptions = [
      // Option 1: new channel, n members, no admin. 
      {
        channelName: "",
        members: members,
        thread: [ message ]
      }, 
      // option 2: new channel, all members added except the admin. 
      {
        channelName: "",
        // filtering the members param to remove the administrator, eg., the parent. 
        members: members.filter(memberID => memberID !== admin ),
        thread: [ message ]
      },
      {
        channelName: "",
        members: members,
        admins: [admin],
        thread: [ message ]
      }
    ];
    // deconstruct the main variables param for easy reaching.
    const { message, members } = params;

    // simple check if optional param admin included, set admin to it where need be. 
    let admin;
    if (params.admin) admin = params.admin;

    // within the scope of a promise to be returned, makke the firebase call to add the channel.
    new Promise((resolve, reject) => {
      firebase.firestore()
        .collection('channels')
        // fires the first option in the payloads array, being the n members no admin declared.
        .add(channelPayloadOptions[0])
        .then(newChannel => {
          if (newChannel.id) {

            // once there's a new channel id, map the members array provided to params and add permissions to that channel for each member in the array. 
            members.map(memberID => {
              firebase.firestore().collection('memberDetails').doc(memberID).update({
                channels: firebase.firestore.FieldValue.arrayUnion(newChannel.id)
              })
            })

            resolve(newChannel.id);
          } else {
            reject(new Error('Encountered an unexpected error:'));
          }
        })
        .catch(err => {
          console.log({err});
        });
    });
  },

  // SPEC: Takes admin (id) and channel (id), returns 
  // FOR: Removing admin permissions from a sender over a channel for any reason.
  // NOTE: this needs a non-heavy way to delete the admins array althoether if no admins remain.
  removeAsAdmin(params) {
    // deconstructing the params option for the two req'd options, an admin id and a channel id. 
    const { admin, channel } = params;
    let currentAdmins;

    // getting what we need from firebase as pertains to admins. 
    firebase.firestore().collection('channels').doc(channel).get().then(channelInfo => {
      currentAdmins = channelInfo.data().admins;
    });

    const newAdmins = currentAdmins.filter(adminID => adminID !== admin);

    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection('channels')
        .doc(channel)
        .update({
          admins: newAdmins
        })
        .then(success => {
          resolve(success);
        })
        .catch(error => {
          reject(error);
        });
    });  
  },

  // SPEC:
  // FOR: Adding admin permissions over a channel I created and have since decided I want access to / getting admin permissions over channels where my child is a member and I want to moderate what they see.
  // NOTE: Flagged as a problem. Can't just have people going around willy-nilly adding themselves as admins to channels their children are on--can we? 
  addAdmin(params) {
    // whaaaaaat? 
  },

  // also tough. Function needs to search through a thread and enable all messages within the thread to be visibile to their child only with the proper permissions. This more than likely requires admin permissions over the thread rather than admin permissions over the child. 
  screenThread(params) {
    // uhhhhhh.....
  },
  // SPECS: takes INT commentIndex, STR channel ID, STR admin ID, if successful returns new thread length + success message. 
  // FOR: Admins to remove a comment they dislike from thead access. 
  deleteComment(params) { 
    // good old destructuring. 
    const { commentIndex, channelID, adminID } = params;

    return new Promise((resolve, reject) => {
      firebase.firestore().collection('channels').doc(channelID).get().then(channel => {

        // saving the admins and the thread. 
        const channelAdmins = channel.data().admins;
        const thread = channel.data().thread;

        if (channelAdmins.includes(adminID)) {
          const newThread = thread.splice(commentIndex, 1);
          firebase.firestore()
            .collection('channels')
            .doc(channelID)
            .update({
              thread: newThread
            })
            .then(() => {
              resolve({
                message: "Successfully deleted message.",
                threadLength: newThread.length
              });
            })
            .catch(err => {
              reject(err);
            });
          } else {
            reject(new Error("User did not have permission to delete comments from this channel."));
          }
      });
    });
  }
}

export default permissions;