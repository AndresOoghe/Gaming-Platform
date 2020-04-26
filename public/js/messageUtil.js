const removeMessage = (className) => {
    const el = document.getElementsByClassName(className)[0];
    el.parentNode.removeChild(el);
};