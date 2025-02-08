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
    const cogatTitles = {
      "62573409-2c63-491d-8e5b-f7a9e3816670": "FullName",
      "1b761720-2a80-41ac-961e-d3f02f0d48fe": "FullNameConfirm",
      "0c5db274-c2a0-46e6-85ea-9e8c861bfac5": "Communication",
      "a6784ffb-11a4-40a1-8b38-f08bf04ba6aa": "Grade",
      "c881b44e-1279-4cfa-b636-d3dcb0605c3a": "ParentName",
      "c1250d35-7be4-4f39-8ca0-5ff9d4df1e94": "ParentPhoneNumber",
      "1c03003a-556c-4349-833d-30bd59457d15": "ParentPhoneNumberAlt",
      "accb041c-4104-44b0-b65d-91bc7b7f90e1": "ParentEmailAddress",
      "58f8d8db-832d-41e4-808b-05564c9e7ade": "ParentEmailAddressAlt",
      "3530dd2d-5983-4b30-99a3-148f09e5136d": "DOB",
      "e826729c-7374-4d99-8ae3-1fc2457a0028": "Address",
      "ff93f332-e3d6-45d5-8734-3104dcf56fb7": "Gender",
      "63d8d522-aba1-443e-9a3d-2b5d0c090cb2": "IEPor504",
      "077ca2d5-1b96-48a6-b6e5-256a67e7c6bc": "DPSCD",
      "e8daf2c9-a764-4998-9bc2-c40f2027ea79": "StudentNumber",
      "6c72f6de-0e51-4bbe-95ed-3e1993bc6a5c":
        "Please re-enter the student's DPSCD Student ID number.",
      "4b8e0616-5401-448c-8929-32bfde660a61": "DPSCDSchool",
      "c9a4f05d-c6c1-4483-ab80-e67cf306d514": "SEMCOG",
      "bda45a45-6c8c-4087-9af6-ad18a285e790": "OODSchool",
      "d0b043df-0f32-4b7e-bbe4-1af96401644a": "OtherSchool",
      "9482d43f-ed60-4967-8c37-89d79c7d6d5c": "OtherSchoolLocation",
      "24a99e02-f113-4a16-9fed-798baff2ea25": "FirstChoiceSchool",
      "f8e42050-c8de-4ef4-9eb0-809142e6c438": "SecondChoiceSchool",
      "dba8d3cb-4693-492d-8726-030dfe911927": "ThirdChoiceSchool",
      "cf9edb6d-9d2e-4bd7-9b9f-6c7fa113ec75": "DescribeSibmings",
      "258cd1ca-5e63-4389-a5eb-50db9646d77e": "SiblingAttendingDescription",
      "a7e2b74f-49ee-4461-a49f-8a5d4eb4d642": "SiblingAttendingSchools",
      "e084ecd4-2dc0-487a-8f47-426ec6d1c371": "SiblingEdison",
      "b83b6b75-e8a4-49ca-8777-6c72599e8fd7": "SiblingEdmonson",
      "40c825ae-d0ee-4d07-96d9-20f970773a1c": "SiblingPalmer",
      "205ce82e-7b64-4267-823f-83ab183114e4": "SiblingMarygrove",
      "3e1b90fe-721f-4c66-a21b-a53e981f6c65":
        "SiblingApplyingTogetherDescription",
      "e52b727d-8889-4166-aae5-064ab397a55e": "SiblingApplyingTogether",
      "9d74a4fa-a15c-4be7-8648-85ac41ee7a04": "ExamConfirmation1",
      "759aa33f-2990-4fad-9eb9-454d242825e1": "BLANK",
      "d8d983c8-5311-494c-a3f8-37d4c5f33786": "ChryslerExpectations",
      "a4b4c1ac-45e4-4048-bd3e-d3417e89abe6": "ExamConfirmation2",
      "c662d859-01b5-45cd-a707-758ae8ebe062": "EdisonAltGradeOption",
      "d85e1a6b-c394-4ed2-8d4d-2760e3b7582f": "ExamConfirmation3",
      "3751845d-9493-4e7d-9885-4cb6a6ff7ce4":
        "I have read and understand the FLICS scholar and parent expectations",
      "d43c2791-cb9d-418d-8914-9d09c5d288fd": "OtherLanguage",
      "d24f58e7-7e46-4255-af35-321274a1c799": "OtherLanguageList",
      "5c15717c-3493-4b1c-9065-64b33e5bf9e0": "LanguageFirstChoice",
      "8ea0fba4-ee30-4ee7-a344-68788dc663c6": "LanguageSecondChoice",
      "fec10272-3e12-40e7-9626-38c4eee8f686": "LanguageThirdChoice",
      "e5ca8a6d-4feb-4295-91dc-be85d8e00344": "PreviousMontessori",
      "87b8593e-16a1-4ea9-a777-c1057ccbe72b": "PreviousMontessoriExperience",
      "8f4784ef-81c6-42ef-981b-9f4db24a245d": "PreviousMontessoriEvidence",
      "73589ef5-7ff7-4990-bccd-8278b02cf7c5": "PreviousMontessoriSchool",
      "3c8090f7-1045-42f0-90e2-8e5c1866823d": "PreviousMontessoriSchoolPhone",
      "23628288-0957-4804-a618-16e59fc74231": "PreviousMontessoriContactPhone",
      "b0f6a139-34c3-49ed-9e6f-b14868a79087": "PreviousMontessoriContactEmail",
      "8283470c-d542-4eae-a2b8-e7e180e59526": "RequestMontessoriProof",
      "9bb62593-b2f7-49d5-aa90-136f30605d0e": "IFAPPLICABLE",
      "10a4ec50-ff78-40bb-88f9-21ec3adea15e": "PreviousMontessoriDocumentation",
      "a04d38dc-87c7-4e45-a819-d4bf3013ca61":
        "PreviousMontessoriDocumentationDescribe",
      "281a6e17-db99-41aa-916d-8e488fdfea2a": "PreviousMontessoriHomeschool",
      "25d1ab57-f3ce-44b8-86e1-3ef1f529ccbc":
        "PreviousMontessoriHomeschoolDescribe",
      "4c894b54-85f8-44e7-aa56-33015faf2e9e": "TestScores",
      "a2ac758a-c49f-4611-8343-03f8caddbc9a": "NWEAMAPScores",
      "897efc4b-e497-4586-bacc-124d1c990374": "iReadyScores",
      "bc92696c-5a13-437d-8fed-d4bb37c22088": "OtherScores",
      "dc332818-89c2-4f7d-855a-b15c8982a033": "IEPUpload",
      "bba634ca-3f1d-44e8-b543-f65fbfc18041": "504Upload",
      "2ce29a5b-5a0e-461c-ab1b-a02103905efd": "DPSCDEmployee",
      "2c0b2dde-ec6f-4f2a-ac8b-addad3e35f7a": "DPSCDEmployeeName",
      "898e8e91-2414-4e5a-b17e-d42b4e0dcd2b": "DPSCDEmployeeID",
      "668303e7-981d-4f15-a565-040e639449c1": "ParentSignature",
      "68b581e6-9eee-4a52-92e2-4cc3fe7b5bc7": "CheckYourWork",
      "b88e0634-bf00-4eb4-ab79-a459ee77cbc1": "SubmissionConfirmation",
      "73aa19e2-efae-4f66-8e31-6cba4d57b585": "SchoolFull",
      "54180b48-9a63-4e01-beba-6d6d034060e9": "MontessoriOnly",
      "2aa92f13-856e-43f4-8829-901aba271bdb": "Round4Update",
    };
    let questionTitles: { [key: string]: string } = {};

    // Set the questionTitles depending on the form
    if (body.formId === "abc92aa5-19e8-4af7-927e-285e1ab2efe6") {
      questionTitles = brigTitles;
    } else if (body.formId === "3bd061d2-9d33-40d0-8c14-9ab11983810e") {
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
