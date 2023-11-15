import { useEffect } from "react";

const FacebookChat = () => {
  const setupFB = () => {
    const chatbox = document.getElementById("fb-customer-chat");
    chatbox?.setAttribute("page_id", "177959832056731");
    chatbox?.setAttribute("attribution", "biz_inbox");
    const config: any = window;

    config.fbAsyncInit = function () {
      config.FB.init({
        xfbml: true,
        version: "v18.0",
      });
    };

    (function (d, s, id) {
      let js: any;
      let fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  };
  useEffect(() => {
    setupFB()
  }, []);

  return (
    <div>
      <div id="fb-root"></div>
      <div id="fb-customer-chat" className="fb-customerchat"></div>
    </div>
  );
};

export default FacebookChat;
