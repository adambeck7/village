// determine all permissions handling for easy implementation on the frontend.
// removed channelID parameter owing to a new data-saving idea: if there is an administrator on the channel, they can elect to have permissions for each comment sent to them. Although now that I'm writing this I'm seeing the flaw in it being that there are n types of admin privileges, not just one. 

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
        admin: admin,
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
}

export default permissions;