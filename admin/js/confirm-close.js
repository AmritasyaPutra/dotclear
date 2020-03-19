/*global getData, dotclear */
'use strict';

const confirmClose = function() {
  if (arguments.length > 0) {
    for (let i = 0; i < arguments.length; i++) {
      this.forms_id.push(arguments[i]);
    }
  }
};

confirmClose.prototype = {
  prompt: 'You have unsaved changes.',
  forms_id: [],
  forms: [],
  form_submit: false,

  getCurrentForms: function() {
    // Store current form's element's values

    const eltRef = (e) => e.id != undefined && e.id != '' ? e.id : e.name;

    const formsInPage = this.getForms();
    this.forms = [];
    for (let i = 0; i < formsInPage.length; i++) {
      const f = formsInPage[i];
      let tmpForm = [];
      for (let j = 0; j < f.elements.length; j++) {
        const e = this.getFormElementValue(f[j]);
        if (e !== undefined) {
          tmpForm[eltRef(f[j])] = e;
        }
      }
      this.forms.push(tmpForm);

      f.addEventListener('submit', () => this.form_submit = true);
    }
  },

  compareForms: function() {
    // Compare current form's element's values to their original values
    // Return false if any difference, else true

    if (this.forms.length == 0) {
      return true;
    }

    const formMatch = (obj, source) => Object.keys(source).every(key => obj.hasOwnProperty(key) && obj[key] === source[key]);
    const eltRef = (e) => e.id != undefined && e.id != '' ? e.id : e.name;

    const formsInPage = this.getForms();
    for (let i = 0; i < formsInPage.length; i++) {
      const f = formsInPage[i];
      let tmpForm = [];
      for (let j = 0; j < f.elements.length; j++) {
        const e = this.getFormElementValue(f[j]);
        if (e !== undefined) {
          tmpForm[eltRef(f[j])] = e;
        }
      }
      if (!formMatch(tmpForm, this.forms[i])) {
        return false;
      }
    }

    return true;
  },

  getForms: function() {
    // Get current list of forms as HTMLCollection(s)

    if (!document.getElementsByTagName || !document.getElementById) {
      return [];
    }

    if (this.forms_id.length > 0) {
      let res = [];
      for (let i = 0; i < this.forms_id.length; i++) {
        const f = document.getElementById(this.forms_id[i]);
        if (f != undefined) {
          res.push(f);
        }
      }
      return res;
    } else {
      return document.getElementsByTagName('form');
    }

    return [];
  },

  getFormElementValue: function(e) {
    // Return current value of an form element

    if (
      // Unknown object
      (e === undefined) ||
      // Ignore unidentified object
      ((e.id === undefined || e.id === '') && (e.name === undefined || e.name === '')) ||
      // Ignore button element
      (e.type !== undefined && e.type === 'button') ||
      // Ignore submit element
      (e.type !== undefined && e.type === 'submit') ||
      // Ignore readonly element
      (e.hasAttribute('readonly')) ||
      // Ignore some application helper element
      (e.classList.contains('meta-helper') || e.classList.contains('checkbox-helper'))
    ) {
      return undefined;
    }

    if (e.type !== undefined && (e.type === 'radio' || e.type === 'checkbox')) {
      // Return actual radio button value if selected, else null
      return (e.checked ? e.value : null);
    } else if (e.type !== undefined && e.type === 'password') {
      // Ignore password element
      return null;
    } else if (e.value !== undefined) {
      // Return element value if not undefined
      return e.value;
    } else {
      // Every other case, return null
      return null;
    }
  }
};

window.addEventListener('load', () => {
  const confirm_close = getData('confirm_close');
  confirmClose.prototype.prompt = confirm_close.prompt;

  dotclear.confirmClosePage = new confirmClose(...confirm_close.forms);

  dotclear.confirmClosePage.getCurrentForms();
});

window.addEventListener('beforeunload', (event) => {
  if (event == undefined && window.event) {
    event = window.event;
  }

  if (dotclear.confirmClosePage !== undefined && !dotclear.confirmClosePage.form_submit && !dotclear.confirmClosePage.compareForms()) {
    event.returnValue = dotclear.confirmClosePage.prompt;
    return dotclear.confirmClosePage.prompt;
  }
  return false;
});
