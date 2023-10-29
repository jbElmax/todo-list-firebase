import {initializeApp} from 'firebase/app';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
    } from 'firebase/auth';
import {
        getFirestore,
        doc,
        getDoc,
        setDoc,
        addDoc,
        collection,
        query,
        getDocs,
        where,
        updateDoc,
        deleteDoc,

      }from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBwIBR1JzydhjU0Hcdr2Q_sYWHf87sNA_w",
    authDomain: "todolist-e6c98.firebaseapp.com",
    projectId: "todolist-e6c98",
    storageBucket: "todolist-e6c98.appspot.com",
    messagingSenderId: "43451327226",
    appId: "1:43451327226:web:ed393affcd4ca89f9f9f43",
    measurementId: "G-G96P6FJ8NH"
}

initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth,googleProvider);
export const db = getFirestore();

export const createAuthUserWithEmailAndPassword = async (email,password)=>{
    if(!email || !password) return;
    return await createUserWithEmailAndPassword(auth,email,password);
  }
  
  export const signInAuthUserWithEmailAndPassword = async (email,password)=>{
    if(!email || !password) return;
    return await signInWithEmailAndPassword(auth,email,password);
  }
  
  export const signOutUser = async () =>await signOut(auth);
  
  export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth,callback);
  
  export const createUserDocumentFromAuth = async (
    userAuth,
    additionalInformation = {}
    ) =>{
    const userDocRef = doc(db,'users',userAuth.uid);
  
    const userSnapshot = await getDoc(userDocRef);
  
    if(!userSnapshot.exists()){//create the doc
      const {displayName, email} = userAuth;
      const createdAt = new Date();
  
      try {
        await setDoc(userDocRef,{
          displayName,
          email,
          createdAt,
          ...additionalInformation
        });
      } catch (error) {
        console.log('error creating user',error.message);
      }
    }
    return userDocRef;
  };

  export const createTaskDoc = async(
    userAuth,
    taskDescription
  )=>{

    if(userAuth){
      const email = userAuth.email;
      const createdAt = new Date();
      const isDone = false;
      try{

        const tasksCollection = collection(db, 'tasks');

        await addDoc(tasksCollection, {
          taskDescription,
          email,
          createdAt,
          isDone,
        });
      }catch(error){
        console.log('error creating task',error)
      }
    }else{
      console.error('userAuth is missing');
    }

  }
  export const deleteAllTask = async()=>{
    const docRef = query(collection(db, "tasks"));

    //Then download all those documents using getDocs
    const toDelete = await getDocs(docRef);
    
    //Finally iterate through all of the documents, deleting each of them one by one
    toDelete.forEach(async(item) => {
      const ID = item.id;
      await deleteDoc(doc(db, "tasks", ID));
    })

  }

  export const getTasksRecords = async(email,callback) =>{
    const q = query(collection(db,'tasks'),where("email","==",email));

    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
  
    if (callback) {
      callback(documents); // Call the callback with the fetched documents
    }
  }

  export const setTaskDone = async(task)=>{
    const taskDocRef = doc(db, 'tasks', task.id);

    try {
      // Update the "isDone" field in Firestore
      await updateDoc(taskDocRef, {
        isDone: !task.isDone,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }
  export const updateTaskDescription = async(task,newTaskDescription)=>{
    const taskDocRef = doc(db, 'tasks', task.id);

    try {

      await updateDoc(taskDocRef, {
        taskDescription: newTaskDescription,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  }

  export const deleteSingleTask = async(task)=>{
    await deleteDoc(doc(db, "tasks", task.id));
  }

