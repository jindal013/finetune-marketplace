import pyrebase

firebaseConfig ={
  "apiKey": "AIzaSyBz0XRFZjisjl2m2kjefJwt5ydxUc5FabA",
  "authDomain": "finetunemarketplace-1323f.firebaseapp.com",
  "databaseURL": "https://finetunemarketplace-1323f-default-rtdb.firebaseio.com/",
  "projectId": "finetunemarketplace-1323f",
  "storageBucket": "finetunemarketplace-1323f.firebasestorage.app",
  "messagingSenderId": "163760710265",
  "appId": "1:163760710265:web:676a8e7c5116ad6661eaa8",
  "measurementId": "G-2HQ21J89S1",
  # "serviceAccount": "serviceAccount.json"
}
storage = pyrebase.initialize_app(firebaseConfig).storage()

if __name__ == '__main__':

  storage.child("link/test.txt").put("../ai")