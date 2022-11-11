(() => {
  let currentIndex = 0;
  let filelist = [];
  let Video;
  let VideoList;

  const linkClickHandler = (e) => {
    e.preventDefault();
    const { href, index } = e.target.dataset;

    currentIndex = index;
    Video.src = "/video/" + href;
    const url = new URL(window.location.origin + `/filename/${href}`);
    window.history.pushState({}, "", url);

    console.log(currentIndex);
    toggleColor(currentIndex);
  };

  window.addEventListener("load", async () => {
    Video = document.querySelector("video");
    VideoList = document.getElementById("VideoList");

    filelist = await fetch("/filelist").then((res) => res.json());
    filelist.forEach((file, index) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.dataset.href = file;
      a.dataset.index = index;
      a.innerText = file;
      a.addEventListener("click", linkClickHandler);
      li.append(a);
      VideoList.append(li);
    });

    if (window.location.pathname?.length > 0) {
      const parts = window.location.pathname
        .split("/")
        .filter((part) => part?.length > 0);
      Video.src = "/video/" + parts[1];
      currentIndex = filelist.findIndex((file) => file === parts[1]);
      toggleColor(currentIndex);
    }
  });

  window.addEventListener("keydown", (e) => {
    if (!["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(e.key))
      return;

    console.log('on keydown', e.key)

    switch (e.key) {
      case "ArrowUp":
      case "ArrowLeft":
        currentIndex -= 1;
        if (currentIndex < 0) currentIndex = filelist.length - 1;
        break;
      case "ArrowDown":
      case "ArrowRight":
        currentIndex += 1;
        if (currentIndex > filelist.length - 1) currentIndex = 0;
        break;
    }

    Video.src = "/video/" + filelist[currentIndex];
    const url = new URL(
      window.location.origin + `/filename/${filelist[currentIndex]}`
    );
    window.history.pushState({}, "", url);
    toggleColor(currentIndex);
  });

  function toggleColor(newIndex) {
    newIndex = parseInt(newIndex);
    filelist.forEach((file, index) => {
      const selector = `a[data-index="${index}"]`;

      if (document.querySelector(selector)) {
        document.querySelector(selector).style.color = "blue";
        document.querySelector(selector).style.fontWeight = "initial";
      }
      if (newIndex === index) {
        if (document.querySelector(selector)) {
          document.querySelector(selector).style.color = "red";
          document.querySelector(selector).style.fontWeight = "800";
        }
      }
    });
  }
})();
