const hamburgerBtn = document.getElementById("hamburger-btn");
const headerNav = document.querySelector(".l-header__nav");
if (hamburgerBtn && headerNav) {
  hamburgerBtn.addEventListener("click", function() {
    hamburgerBtn.classList.toggle("active");
    headerNav.classList.toggle("active");
    document.body.classList.toggle("open");
  });
  headerNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function() {
      if (document.body.classList.contains("open")) {
        hamburgerBtn.classList.remove("active");
        headerNav.classList.remove("active");
        document.body.classList.remove("open");
      }
    });
  });
}
const triggers = document.querySelectorAll(".js-header-sub-nav-trigger");
if (triggers.length > 0) {
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function() {
      this.classList.toggle("active");
    });
  });
}
window.addEventListener("scroll", function() {
  let header = document.querySelector(".l-header");
  if (document.querySelector(".p-mv")) {
    document.querySelector(".p-mv").offsetHeight;
  }
  let headerHeight = header.offsetHeight;
  let scroll = window.scrollY;
  if (document.body.classList.contains("p-top")) {
    if (scroll > mvHeight) {
      header.style.backgroundColor = "#00274b";
    } else {
      header.style.backgroundColor = "";
    }
  } else {
    if (scroll > headerHeight) {
      header.style.backgroundColor = "#00274b";
    } else {
      header.style.backgroundColor = "";
    }
  }
});
const selects = document.querySelectorAll(".p-form__select-wrap select");
selects.forEach((select) => {
  select.addEventListener("change", function() {
    if (this.value === "placeholder") {
      this.style.color = "#b1b1b1";
    } else {
      this.style.color = "#333333";
    }
  });
});
let isFormDirty = false;
let isSubmitting = false;
if (document.querySelector(".p-form__body")) {
  document.querySelector(".p-form__body").addEventListener("input", function() {
    isFormDirty = true;
  });
  document.querySelector(".p-form__body").addEventListener("submit", function() {
    isSubmitting = true;
  });
  window.addEventListener("beforeunload", function(e) {
    if (isFormDirty && !isSubmitting) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}
const addButton = document.querySelector(".p-button__add-btn");
const formBox = document.querySelector(".p-add-form__box");
addButton.addEventListener("click", function() {
  const newFormBox = formBox.cloneNode(true);
  const removeButton = document.createElement("button");
  removeButton.textContent = "＋";
  removeButton.classList.add("p-add-form__remove");
  removeButton.addEventListener("click", function() {
    newFormBox.remove();
  });
  newFormBox.appendChild(removeButton);
  document.querySelector(".p-add-form__content").insertBefore(newFormBox, addButton.parentNode);
});
