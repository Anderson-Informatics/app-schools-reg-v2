export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Get the runtimeconfig SUBMITTABLE API KEY
  const SUBMITTABLE_API_KEY = useRuntimeConfig().SUBMITTABLE_API_KEY;
  const headers = {
    Accept: "application/json",
    Authorization: `Basic ${SUBMITTABLE_API_KEY}`,
  };
  // Define interfaces for form fields and options
  interface FormField {
    formFieldId: string;
    label: string;
    options?: FormOption[];
  }
  interface FormOption {
    formOptionId: string;
    label: string;
  }
  // Define interfaces for the expected response structure
  interface FormEntry {
    formType: string;
    entry: {
      fieldData: Array<{
        formFieldId: string;
        options?: string[];
        fieldType?: string;
        address1?: string;
        address2?: string;
        city?: string;
        region?: string;
        postalCode?: string;
        country?: string;
        firstName?: string;
        lastName?: string;
        value?: string;
      }>;
    };
  }
  interface SubmissionResponse {
    formEntries: FormEntry[];
  }
  try {
    // Fetch the form data from Submittable
    // Get the form data from the submittable api to set question headers and values
    const form: { fields: FormField[] } = await $fetch(
      `https://submittable-api.submittable.com/v4/forms/${body.formId}`,
      {
        method: "GET",
        headers: headers,
        simple: true,
      }
    );
    // Initiate questions and answers objects
    let questions: { [key: string]: string } = {};
    let answers: { [key: string]: string } = {};

    // Loop through each field from the form and extract the formFieldId to use as property name
    // and the label to use as the values (just begins the humanization of the messy submittable schema)
    form.fields.forEach((item) => {
      if (item.label) {
        questions[item.formFieldId] = item.label;
      }
      if (item.options) {
        item.options.forEach((option) => {
          answers[option.formOptionId] = option.label;
        });
      }
    });

    const brigTitles = {
      "d560f331-cd26-431e-895d-7ffdf608d258": "FullName",
      "dda8e5cd-ce67-45da-a440-460c733dcc51": "FullNameConfirm",
      "0a2ff33e-96bb-4e69-882e-3b0a3d3478da": "Communication",
      "24cca0ee-ba14-4752-848c-b2fca98f52f1": "Grade",
      "00d13b50-e77f-4685-98a0-6cfbf2d97a34": "ParentName",
      "67e74bc7-e4b3-4131-910f-2065994e2520": "ParentPhoneNumber",
      "f55340db-7bf9-4471-ad0c-240c2661a69d": "ParentPhoneNumberAlt",
      "f29d511b-68ba-4837-be8c-b245528e9923": "ParentEmailAddress",
      "424e8ef9-2b49-48a1-b3b2-5557fb1e91f5": "ParentEmailAddressAlt",
      "f234ec19-6407-4b6a-a2b1-27836d56d53e": "DOB",
      "da2c1785-81c6-4f11-bbb3-74c60627396d": "Address",
      "9732554a-c295-4b45-a9ea-494cb06eb40b": "Gender",
      "3f88991a-b4b1-47ca-b443-8a712441ce56": "IEPor504",
      "a402cbfc-75cb-4f69-a282-69f16e20659a": "DPSCD",
      "cfef0dae-8a34-4fcd-b97d-8e85289eef43": "StudentNumber",
      "36bd7cc3-b66f-4390-83dc-009147038514": "DPSCDSchool",
      "3182ff55-b3d5-484e-bebd-f307c3e4f1e3": "SEMCOG",
      "1275698c-7c47-41cd-b905-771dd628afaa": "OODSchool",
      "5e6285d2-2a73-46ad-8265-d28c614714bf": "OtherSchool",
      "a96dd5b0-a4f6-4fb1-afb9-f883499f0aac": "OtherSchoolLocation",
      "ee8e91f9-2b62-4039-8fee-e93d478b27c6": "FirstChoiceSchool",
      "642ae57b-f4fa-4bfa-8938-6f351748078d": "SecondChoiceSchool",
      "a2f181f1-078a-483d-a9a7-24b1db9aa848": "ThirdChoiceSchool",
      "578194d5-20ee-4a46-ab40-b09982c12e61": "DescribeSiblings",
      "3fc8da27-06e9-470d-b9d6-990c9c3a0661": "SiblingAttendingDescription",
      "1aa97392-cba7-453e-8302-27bcf6cbd07e": "SiblingAttendingSchools",
      "5f649526-19d9-46c9-987b-f2a9fd8fa25c": "SiblingEdison",
      "7427f037-de47-493c-8675-4e099237c435": "SiblingEdmonson",
      "4c108fb8-b16b-4af8-a5ae-73bfc07473ad": "SiblingPalmer",
      "072b48e1-fc03-4c3a-be28-d19269e8fea4": "SiblingMarygrove",
      "5e1e0a01-33c1-4bce-ad25-cf630b8bdaf4":
        "SiblingApplyingTogetherDescription",
      "220d41e6-57b6-4be2-8c68-925838a2f8d9": "SiblingApplyingTogether",
      "f0c21d05-a11d-44f6-830b-100f599fc120": "ExamConfirmation1",
      "d87257e7-c183-4a44-a765-6d9761a8be21": "ChryslerExpectations",
      "60b72aef-fb59-4b55-a985-5322c87795f8": "ExamConfirmation2",
      "2b3ea0a2-c550-4632-a16e-0c2f752bf8a4": "FLICSExpectations",
      "ee8cf6e8-52fa-4dbf-8086-bc04688bec0b": "OtherLanguage",
      "69d2eac4-ad95-49e3-8e81-e7d1d9573468": "OtherLanguageList",
      "cbad5dfb-9264-4e28-ba7f-84a3cf6714ea": "LanguageSelection",
      "6ba12781-6bf3-46ae-8a03-bf7f29640104": "LanguageFirstChoice",
      "826e70b2-9381-4025-90ef-a8549c7a62c0": "LanguageSecondChoice",
      "a64eed4f-24e4-4c85-93df-a1b6f39ad46e": "LanguageThirdChoice",
      "a0f63bc0-d3bd-4313-a6e3-de00022f2753": "ExamConfirmation3",
      "00c9b0b8-e700-48b4-afeb-854c5a8c8414": "PreKFLICS",
      "3e47915b-fca4-4a03-a762-67e2c22e5e07": "ExamRequirements",
      "09c91429-5dfb-4697-ae80-d736be3da7a4": "IFAPPLICABLE",
      "e565525f-82de-4555-b94b-005aa20c130a": "IEPUpload",
      "b129bee9-c30c-4ed5-a43b-7e5d772e1e47": "504Upload",
      "1e6e6be1-59d4-4f6a-ab98-62728d630999": "SpeechUpload",
      "4125335a-bbda-4da5-a0a2-f87b0ba5067d": "DPSCDEmployee",
      "1b2757c9-baf4-41dc-9618-3adc16576b59": "DPSCDEmployeeName",
      "abeb59eb-17dc-40a4-a06b-421a41d80eee": "DPSCDEmployeeID",
      "db9f8ca5-efc5-4897-bc89-9a676fe31b8c": "ParentSignature",
      "c8fa1471-0b3b-4e7e-881d-33c4e4ee6ddd": "CheckYourWork",
      "ae9ef9b5-6e22-45cd-83c0-3a5451a881ab": "SubmissionConfirmation",
      "337b7c33-73dc-4d5e-a5de-9cb8cd51a630": "SchoolFull",
      "4f3af0e1-663d-4d87-88b5-1c4af08475ef": "KINDERGARTENUPDATE",
      "21d6c64f-bb4e-45b8-a0e4-6239a814ebf8": "GRADEXXUPDATE",
      "cd97c9b4-9cfd-4ed0-abd0-7829f7ee95d3": "MONTESSORI",
    };
    const cogatTitles = {};
    let questionTitles: { [key: string]: string } = {};

    // Set the questionTitles depending on the form
    if (body.formId === "abc92aa5-19e8-4af7-927e-285e1ab2efe6") {
      questionTitles = brigTitles;
    } else if (body.formId === "7479e087-1f45-4226-b0ca-5c992db20cd8") {
      questionTitles = cogatTitles;
    }

    // Fetch the submission data from Submittable
    const response = (await $fetch(
      `https://submittable-api.submittable.com/v4/entries/submissions/${body.submissionId}`,
      {
        method: "GET",
        headers: headers,
        simple: true,
      }
    )) as SubmissionResponse;

    // Extract the "initial" application data (that is all we care about here)
    const application = response.formEntries.filter((each) => {
      return each.formType === "initial";
    })[0].entry.fieldData;

    let submission: { [key: string]: string } = {};

    // This is where the more complicated processing happens
    let name_field_count = 1; // This is used to sequentially number name fields
    application.forEach((item) => {
      if (item.options) {
        if (item.options.length === 1) {
          submission[questionTitles[item.formFieldId]] =
            answers[item.options[0]];
        } else if (item.options.length > 1) {
          let val = "";
          item.options.forEach((option) => {
            if (val.length === 0) {
              val = answers[option];
            } else {
              val = val.concat(";", answers[option]);
            }
          });
          submission[questionTitles[item.formFieldId]] = val;
        }
      } else if (item.fieldType === "address") {
        submission["Address1"] = item.address1 ?? "";
        submission["Address2"] = item.address2 ?? "";
        submission["City"] = item.city ?? "";
        submission["State"] = item.region ?? "";
        submission["Zip"] = item.postalCode ?? "";
        submission["Country"] = item.country ?? "";
      } else if (item.fieldType === "name") {
        submission[`FirstName${name_field_count}`] = item.firstName ?? "";
        submission[`LastName${name_field_count}`] = item.lastName ?? "";
        name_field_count++;
      } else if (item.value) {
        submission[questionTitles[item.formFieldId]] = item.value ?? "";
      }
    });

    // Return the application data
    return submission;
  } catch (error: any) {
    console.log(`${error.status} - ${error.data.messages[0]}`);
    return { message: `${error.status} - ${error.data.messages[0]}` };
  }
});
