// src/layouts/AppLayout.tsx

import { Outlet } from 'react-router-dom';


const AppLayout = () => {
  return (
    <div>
      {/* <Navbar />  */}
      <main>
        <Outlet /> {/* Renders the content of the current child route */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default AppLayout;