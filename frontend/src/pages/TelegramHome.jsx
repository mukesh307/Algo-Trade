import { useState } from "react";
import TelegramLogin from "../components/TelegramLogin";
import Channels from "../components/Channels";


const TelegramHome = () => {
  const [phone, setPhone] = useState(null);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {!phone ? (
        <TelegramLogin onTelegramLogin={setPhone} />
      ) : (
        <>
          <Channels phone={phone} />
      
        </>
      )}
    </div>
  );
};

export default TelegramHome;
