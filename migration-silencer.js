Hooks.once("init", function () {
  const waitForElm = (selector, innerSelector, text) => {
    return new Promise(resolve => {
      if (
        document.querySelector(selector) &&
        document
          .querySelector(selector)
          .querySelector(innerSelector)
          .textContent.trim() === text
      ) {
        return resolve({
          elm: document.querySelector(selector)
        });
      }

      const observer = new MutationObserver(mutations => {
        if (
          document.querySelector(selector) &&
          document
            .querySelector(selector)
            .querySelector(innerSelector)
            .textContent.trim() === text
        ) {
          observer.disconnect();
          resolve({
            elm: document.querySelector(selector)
          });
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  };
  const waitForElmRemoval = elm => {
    return new Promise(resolve => {
      const observer = new MutationObserver(mutations => {
        if (mutations[0].removedNodes[0] === elm) {
          observer.disconnect();
          resolve();
        }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  };
  waitForElm(".dialog", ".window-title", "Migration").then(({ elm }) => {
    const interval = window.setInterval(() => {
      if (elm.querySelector(".header-button.control.close") !== null) {
        waitForElmRemoval(elm).then(() => {
          console.log(
            "Migration Silencer | Successfully closed Migration Notice"
          );
          window.clearInterval(interval);
        });
        elm.querySelector(".header-button.control.close").click();
      }
    }, 500);
  });
});
