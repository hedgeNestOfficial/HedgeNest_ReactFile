// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { Provider } from "react-redux";

// import { PersistGate } from "redux-persist/integration/react";

// import { store, persistor } from "./Store/store";

// import App from "./App.jsx";

// import "./index.css";

// import { Toaster } from "react-hot-toast";
// import SplashScreen from "./Components/SplashScreen.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <Provider store={store}>
//       <PersistGate loading={<SplashScreen />} persistor={persistor}>
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//           }}
//         />
//         <App />
//       </PersistGate>
//     </Provider>
//   </StrictMode>,
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";

import { store, persistor } from "./Store/store";
import App from "./App.jsx";
import SplashScreen from "./Components/SplashScreen.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    {/* PersistGate delays app rendering until redux-persist rehydration is complete */}
    <PersistGate loading={<SplashScreen />} persistor={persistor}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <App />
    </PersistGate>
  </Provider>,
  {
    /* </StrictMode>, */
  },
);
