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
      completedAt: string;
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
      "e93dc70e-9fc3-4b74-98b2-a2498b8386d0": "FullName",
      "d716c644-9437-4be7-83e0-7acfb9cdf119": "FullNameConfirm",
      "a7eb0ae5-4107-4f4b-8fbc-821a36a62544": "Communication",
      "173bdc8a-873c-4259-a05b-7be64bc31d44": "Grade",
      "f4eaed75-7201-4483-a854-58af404b1c5c": "ParentName",
      "2ea2d335-ca89-4791-83c8-65de25436c36": "ParentPhoneNumber",
      "61adea57-f15c-46cc-ba08-7679d15fe70a": "ParentPhoneNumberAlt",
      "a0ac270f-1301-4898-84b1-4818c7007a7a": "ParentEmailAddress",
      "d318f1c4-57f8-47b7-9344-3bd48fee87b3": "ParentEmailAddressAlt",
      "10f47091-f5f9-4dd3-be2f-56d4da860cb4": "DOB",
      "115c627b-1960-4e61-8e0f-94f67006038b": "Address",
      "e0015fc2-50d4-494c-834d-5d3a9911a1b2": "Gender",
      "3c478b1a-bedd-447b-bbff-2280b21e4ca7": "IEPor504",
      "5ab60af3-1108-4826-a8a6-3b6bf0caf2f0": "DPSCD",
      "462a262d-6585-448d-9a26-2c22bd47e8ac": "StudentNumber",
      "be6aa7c3-95de-41dd-ba82-94ceb64896de": "DPSCDSchool",
      "65664f0f-4f2d-4156-9a78-39d326835d9b": "SEMCOG",
      "67e574d5-ba9e-4c5c-bd74-a9a0d383013a": "OODSchool",
      "2bfe3faf-ee79-44b7-91d9-dc1b828a2fe2": "OtherSchool",
      "f973b6c9-de71-4209-b4e4-b716af7c8d96": "OtherSchoolLocation",
      "6e440849-7649-400c-bea2-303687ebda20": "FirstChoiceSchool",
      "87af1b57-704b-4ee5-892d-4885758e277d": "SecondChoiceSchool",
      "fd274be8-310c-4e19-9388-936ba8eee463": "ThirdChoiceSchool",
      "fcaf4f3f-e2ee-4e96-8257-a89f1963defd": "DescribeSiblings",
      "81afb849-f42f-45a9-b515-aa3a93800e92": "SiblingAttendingDescription",
      "c818fc75-9078-4622-9211-f1b76bc776a3": "SiblingAttendingSchools",
      // No more Edison "b863ccb8-ac25-4a79-a8e8-935e6e72d968": "SiblingEdison", 
      "b863ccb8-ac25-4a79-a8e8-935e6e72d968": "SiblingEdmonson",
      "9f4a6e7e-776a-4151-a134-2bc78b6c43d5": "SiblingPalmer",
      "940d61df-89fd-4ebd-a3a9-424fe2bbf821": "SiblingMarygrove",
      "e74d8d1b-3d80-4fa4-9a1b-a49a22c4807b":
        "SiblingApplyingTogetherDescription",
      "4946b43c-706c-4ef7-aa23-38cf7e01417a": "SiblingApplyingTogether",
      "789c6130-58e4-4ed1-ab95-070433e94f7c": "ExamConfirmation1",
      "77611a64-c482-4105-9b8a-d1e1a14295c6": "ChryslerExpectations",
      "e18bdf46-3a4f-403b-97fd-73fe227ebf14": "ExamConfirmation2",
      "b6161eb2-0262-4dab-8bf8-f9f339e77cb9": "FLICSExpectations",
      "7e2e0f9d-3609-45d8-85ed-02863fddab65": "OtherLanguage", 
      "17664c54-5e01-4656-afab-1241503796d9": "OtherLanguageList",
      "aa095615-57da-4c4f-bbc6-2b5582de2f47": "LanguageSelection",
      "e4f83114-a62f-470f-94cb-719327428eff": "LanguageFirstChoice",
      "70d3bea8-f537-40dd-8393-586ddbf3020c": "LanguageSecondChoice",
      "5afc55fc-cabc-4229-814e-77ba8580091c": "LanguageThirdChoice",
      "d6639db9-5ffa-4dcd-9528-c4a94c8e2b64": "ExamConfirmation3",
      "82425bc1-7558-4c59-bf01-b28ea4e5b216": "PreKFLICS",
      "cccc193b-dbac-40ce-b6f5-9663184154c5": "ExamRequirements",
      "cf0065c6-f3f5-438a-954f-c21b54c285a9": "IFAPPLICABLE",
      "ca8585bc-4cec-46ba-9bc3-0c5b66e3575d": "IEPUpload",
      "6115b2ef-c24b-4601-856c-11070600cbb7": "504Upload",
      "1b655a69-4ab6-4011-8e0d-adfbd7f81001": "SpeechUpload",
      "9a3abdbc-f52b-4175-89e8-6e77f1aa9f58": "DPSCDEmployee",
      "d554e1a4-a5cf-44dd-840b-e4d08be0d32a": "DPSCDEmployeeName",
      "1d71b823-d919-40e2-9886-7f46c6ccfe70": "DPSCDEmployeeID",
      "78fb6f22-6f3d-422d-87c6-9d7db14a3103": "ParentSignature",
      "be41da7a-11b6-4242-ba1f-112cb8f9244c": "CheckYourWork",
      "4803271d-c9a8-4184-ab7e-d1975e3bc421": "SubmissionConfirmation",
      "0650c4da-ac81-4fc3-b86e-870fb770975a": "SchoolFull",
      "801f3eec-3d6b-4ea6-9b81-0ddeb67d27ac": "KINDERGARTENUPDATE",
      "c0d569af-b59f-46ea-81ca-062616fc72ee": "GRADEXXUPDATE",
      "fed82909-5dae-466d-8fff-a70719a14ac9": "MONTESSORI",
    };
    const cogatTitles = {
      "c5df619f-b28d-494d-99c5-534fc67af732": "FullName",
      "a648b942-613f-46d0-8a98-19995d949cb2": "FullNameConfirm",
      "f61ee20e-636d-4c1c-8790-091ea2f5b479": "Communication",
      "e5516dfa-b4aa-464a-83ef-d1e2a9afb848": "Grade",
      "30902dbe-b4c6-4011-ab19-7743e9bccddd": "ParentName",
      "9c5fd54e-dca7-4881-b386-1ad0272c7990": "ParentPhoneNumber",
      "923943f4-c785-4541-900c-13c0f39c7aad": "ParentPhoneNumberAlt",
      "a67fd842-cacd-4a51-9a59-4d34e76b329d": "ParentEmailAddress",
      "1e880082-2e44-4380-871e-8fcda4c1274d": "ParentEmailAddressAlt",
      "ff8454a8-9d27-4cbb-a854-7077e957d311": "DOB",
      "74fbdfea-378c-4518-b65c-25e119ab85ed": "Address",
      "5ed5f1d5-5917-4166-bac3-7a629e7796a6": "Gender",
      "16d60c32-543b-40c9-a9cd-e62f507469c9": "IEPor504",
      "cd4e2164-eed7-445d-b260-1e920cd380a1": "DPSCD",
      "8527ac4d-5e58-487b-a3b7-ededf6c3d968": "StudentNumber",
      // "6c72f6de-0e51-4bbe-95ed-3e1993bc6a5c": "StudentNumberRe",
      "1848f07d-22c0-4a03-b67a-d87451b4f650": "DPSCDSchool",
      "e10a0bd7-afe3-4b60-9e5a-da045805c3e3": "SEMCOG",
      "f20d7264-ce7e-4b63-b025-4db389093611": "OODSchool",
      "a184509e-40f9-4084-84eb-d8d2a5bfd4a6": "OtherSchool",
      "e03b4449-3e31-4208-8ae8-57de1499c771": "OtherSchoolLocation",
      "40e59628-d315-4f66-aa8b-e96b4c5f9bce": "FirstChoiceSchool",
      "8cfe91d6-b03e-4ed8-893d-b9cfcb7d1e48": "SecondChoiceSchool",
      "80753201-7f39-4740-b3d3-b5750cbc709d": "ThirdChoiceSchool",
      "a88ec836-1fbb-414e-8069-368914a399ce": "DescribeSiblings",
      "2586676a-11a4-4d95-b227-b32654e1818e": "SiblingAttendingDescription",
      "56d4c60f-40bc-493e-bc59-27f780139fc8": "SiblingAttendingSchools",
      // "e084ecd4-2dc0-487a-8f47-426ec6d1c371": "SiblingEdison",
      "b38d7954-0f7c-4ff2-9ad9-fe4837d665ef": "SiblingEdmonsonCount",
      "13200612-5fb8-4c96-b070-2924a6b7c93d": "SiblingEdmonson",
      "7a2e72ae-241f-4fbc-9dbb-605aed354b8a": "SiblingPalmerCount",
      "cb02b946-c15b-48f9-a702-c8c3416399eb": "SiblingPalmer",
      "4453a5c5-90cb-416f-91d6-ff5095f22d0d": "SiblingMarygroveCount",
      "daaedaa7-e0f5-468c-8715-00d6946f0824": "SiblingMarygrove",
      "634d1f3c-4fab-4389-9380-af07532c3cc7":
        "SiblingApplyingTogetherDescription",
      "695763ed-0b3f-49f7-989a-9af78f2d105d": "SiblingApplyingTogetherCount",
      "5139e5ad-30eb-42b2-bd00-41ae61044ef6": "SiblingApplyingTogether",
      "3f5c7f59-3ec4-4cfa-b9c5-ba24f4894bb7": "ExamConfirmation1",
      // "759aa33f-2990-4fad-9eb9-454d242825e1": "BLANK",
      "caf3418c-f1fb-4403-8e43-2ee4d0fec33e": "ChryslerExpectations",
      "d7d6f408-aa2f-41ba-8959-ae843385801a": "ExamConfirmation2",
      // "c662d859-01b5-45cd-a707-758ae8ebe062": "EdisonAltGradeOption",
      "925daa17-0da1-48c1-b372-bf6143428c2a": "ExamConfirmation3",
      "946ad2cf-d8c6-4866-8154-3e730b158e37": "FLICSExpectations",
      "cdca8a60-7fdd-4e12-856b-be7ad0b9a4e5": "OtherLanguage",
      "a887f368-223b-4cbd-9969-9f052fc1d0be": "OtherLanguageList",
      "c57ab734-220b-4909-b288-f8bd790d3a82": "LanguageFirstChoice",
      "191eb1cb-7458-41e8-a7ac-f83ba96ea781": "LanguageSecondChoice",
      "907449f7-05e1-48b2-b1ad-c7bf75e059c0": "LanguageThirdChoice",
      "5353972a-93c0-4f72-b829-26691a1732b4": "PreviousMontessori",
      "89c7c812-419a-4fdb-9494-84ea0443a28e": "PreviousMontessoriExperience",
      "1ad5f34d-25e6-4aa4-bfd7-365da14367b6": "PreviousMontessoriEvidence",
      "36a3cbdf-98c8-47c8-bee7-a82a53a25207": "PreviousMontessoriSchool",
      "f2491200-5231-40a9-8f87-0dd88520d723": "PreviousMontessoriSchoolPhone",
      "ec752594-9fd8-4205-b141-115e44dd19b9": "PreviousMontessoriContactPhone",
      "cef593bc-011a-40b0-8424-4b0bd3697a61": "PreviousMontessoriContactEmail",
      "9f8a273b-96fc-4218-a0ff-193a2747f8ee": "RequestMontessoriProof",
      "acafc5bc-40ac-4ac6-b14d-1494e6007031": "IFAPPLICABLE",
      "fd0beadb-65c1-4b6b-8eae-3e298a4a29fd": "PreviousMontessoriDocumentation",
      "4d86dd49-d838-4fe4-bb60-0b893ea2b350":
        "PreviousMontessoriDocumentationDescribe",
      "5cc4a58e-0565-4b4c-a530-7f7cee41262b": "PreviousMontessoriHomeschool",
      "e0210509-f18d-4f2d-b15a-17ddf3008738":
        "PreviousMontessoriHomeschoolDescribe",
      "db2d36e8-e4cd-40ae-b744-d25500360f32": "TestScores",
      "4e5a23b8-42df-4cda-88b5-85c7d3e867a7": "NWEAMAPScores",
      "4088f7c4-2534-4a0a-b9ef-738686b9b657": "iReadyScores",
      "d70e201e-eb82-4f47-b1f6-4e4e85f157e6": "OtherScores",
      "18d71118-d672-49ad-bd4e-b8af0d9bd9b4": "IEPUpload",
      "eafe0374-6c70-4a6f-ac09-d88b6219d250": "504Upload",
      "d2b5aae8-e7c3-4845-87e2-638665cfab57": "DPSCDEmployee",
      "889a0cd3-e3ea-4a0a-a5fb-a96abb37bde0": "DPSCDEmployeeName",
      "173cf544-95b1-42a9-991c-f6f3cf41421e": "DPSCDEmployeeID",
      "1f10be62-c6a1-4fdf-9209-3e03a45d26a4": "ParentSignature",
      "80a8f89e-5f15-4f89-86ee-620b41d07ba8": "CheckYourWork",
      "23cbcb84-9293-4e03-b4f9-223992948b26": "SubmissionConfirmation",
      "6a435853-746b-4a68-b56b-51fe3278f0e0": "SchoolFull",
      "a677726b-dea0-4202-b0bc-eb885dc8efe9": "MontessoriOnly",
      "6ebe5de6-af4d-4b97-82db-b5ce6867d7c6": "Round4Update",
    };
    let questionTitles: { [key: string]: string } = {};

    // Set the questionTitles depending on the form
    if (body.formId === "5377b3b1-6b35-44e2-a810-6142912acc71") {
      questionTitles = brigTitles;
    } else if (body.formId === "27e383d7-1dde-42bb-a300-df23227fb39f") {
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

    const subdate = response.formEntries.filter((each) => {
      return each.formType === "initial";
    })[0].entry.completedAt;
    // Convert subdate to a date object
    const subdateFormatted = new Date(subdate);

    // Categroize Round by sub date
    let round = "";
    if (subdateFormatted <= new Date("2026-04-20")) {
      round = "Round 1";
    } else if (subdateFormatted > new Date("2026-04-20")) {
      round = "Round 2";
    } else {
      round = "";
    }

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

    submission = { ...submission, Round: round };

    // Return the application data
    return submission;
  } catch (error: any) {
    console.log(`${error.status} - ${error.data.messages[0]}`);
    return { message: `${error.status} - ${error.data.messages[0]}` };
  }
});
