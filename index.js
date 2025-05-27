const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT =  process.env.PORT || 5000;
;
// Helper function to convert yes/no strings to boolean
function convertYesNoToBoolean(value) {
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase().trim();
    if (lowerValue === 'yes' || lowerValue === 'y') return true;
    if (lowerValue === 'no' || lowerValue === 'n') return false;
  }
  // If it's already a boolean or other type, return as-is
  return value;
}
// Salesforce token fetcher
async function getAccessToken() {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', process.env.CLIENT_ID);
  params.append('client_secret', process.env.CLIENT_SECRET);
  params.append('username', process.env.SF_USERNAME);
  params.append('password', process.env.SF_PASSWORD);

  try {
    const res = await axios.post(`${process.env.SF_LOGIN_URL}/services/oauth2/token`, params);
    return {
      access_token: res.data.access_token,
      instance_url: res.data.instance_url
    };
  } catch (err) {
    console.error('❌ Failed to fetch Salesforce token:', err.response?.data || err);
    throw err;
  }
}

app.post('/api/onboarding', async (req, res) => {
  const data = req.body;

  try {
    // Step 1: Login to Salesforce
    const { access_token, instance_url } = await getAccessToken();

    // Step 2: Query onboarding form by Name
    const query = `SELECT Id FROM Onboarding_Form__c WHERE Name = '${data.id}' LIMIT 1`;
    const queryRes = await axios.get(
      `${instance_url}/services/data/v58.0/query?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    if (!queryRes.data.records || queryRes.data.records.length === 0) {
      return res.status(404).send({ error: 'Onboarding record not found' });
    }

    const recordId = queryRes.data.records[0].Id;

  const updatePayload = {
      Account__c: data.companyName,
      Is_Incorporated__c: convertYesNoToBoolean(data.isIncorporated),
      Incorporation_Date__c: data.incorporationDate,
      Trading_Activity__c: data.tradingActivity,
      Company_UTR__c: data.companyUtr,
      Company_Number__c: data.companyNumber,
      Ir35_Status__c: data.ir35Status,
      Estimated_Turnover__c: data.estimatedTurnover,
      Business_Street__c: data.businessStreet,
      Business_City__c: data.businessCity,
      Business_Country__c: data.businessCountry,
      Business_Postcode__c: data.businessPostcode,
      Registered_Street__c: data.registeredStreet,
      Registered_City__c: data.registeredCity,
      Registered_Country__c: data.registeredCountry,
      Registered_Postcode__c: data.registeredPostcode,
      First_Name__c: data.firstName,
      Middle_Name__c: data.middleName,
      Last_Name__c: data.lastName,
      Date_of_Birth__c: data.dateOfBirth,
      Nationality__c: data.nationality,
      NI_Number__c: data.niNumber,
      Email__c: data.email,
      Alt_Email__c: data.altEmail,
      Phone__c: data.phone,
      Alt_Phone__c: data.altPhone,
      Home_Street__c: data.homeStreet,
      Home_City__c: data.homeCity,
      Home_Country__c: data.homeCountry,
      Home_Postcode__c: data.homePostcode,
      Moved_In_Date__c: data.movedInDate,
      Previous_Street__c: data.previousStreet,
      Previous_City__c: data.previousCity,
      Previous_Country__c: data.previousCountry,
      Previous_Postcode__c: data.previousPostcode,
      Is_Director__c: convertYesNoToBoolean(data.isDirector),
      Is_Shareholder__c: convertYesNoToBoolean(data.isShareholder),
      Shareholder_Type__c: data.shareholderType,
      Salary_Above_NI__c: convertYesNoToBoolean(data.salaryAboveNi),
      Salary_From_Ltd__c: data.salaryFromLtd,
      Share_Amount__c: data.shareAmount,
      Share_Value__c: data.shareValue,
      Other_Company__c: convertYesNoToBoolean(data.otherCompany),
      Other_Company_Name__c: data.otherCompanyName,
      Other_Company_Start_Date__c: data.otherCompanyStartDate,
      Other_Company_Share_Percent__c: data.otherCompanySharePercent,
      Other_Company_Salary__c: data.otherCompanySalary,
      Self_Assessment_Status__c: data.selfAssessmentStatus,
      Self_Assessment_UTR__c: data.selfAssessmentUtr,
      Employment_Status_April__c: data.employmentStatusApril,
      CAC_Code__c: data.cacCode,
      Share_Changes__c: convertYesNoToBoolean(data.shareChanges),
      Accountant_Name__c: data.accountantName,
      Accountant_Email__c: data.accountantEmail,
      Accountant_Phone__c: data.accountantPhone,
      Contact_Accountant_From__c: data.contactAccountantFrom,
      PAYE_Registered__c: convertYesNoToBoolean(data.payeRegistered),
      PAYE_Reference__c: data.payeReference,
      Accounts_Office_Reference__c: data.accountsOfficeReference,
      PAYE_Setup_Date__c: data.payeSetupDate,
      PAYE_Takeover_Date__c: data.payeTakeoverDate,
      VAT_Status__c: data.vatStatus,
      VAT_Number__c: data.vatNumber,
      VAT_Start_Date__c: data.vatStartDate,
      Last_VAT_Return_End__c: data.lastVatReturnEnd,
      Last_VAT_Box_5__c: data.lastVatBox5,
      First_VAT_Return_Start__c: data.firstVatReturnStart,
      MTD_Used__c: convertYesNoToBoolean(data.mtdUsed),
      VAT_Scheme__c: data.vatScheme,
      Flat_Rate_Sector__c: data.flatRateSector,
      VAT_Accounting_Method__c: data.vatAccountingMethod,
      VAT_Filing_Frequency__c: data.vatFilingFrequency,
      Additional_Contacts__c: convertYesNoToBoolean(data.additionalContacts),
      Additional_Contact1_FirstName__c: data.additionalContact1Firstname,
      Additional_Contact1_LastName__c: data.additionalContact1Lastname,
      Additional_Contact1_Email__c: data.additionalContact1Email,
      Additional_Contact2_FirstName__c: data.additionalContact2Firstname,
      Additional_Contact2_LastName__c: data.additionalContact2Lastname,
      Additional_Contact2_Email__c: data.additionalContact2Email,
      Additional_Contact3_FirstName__c: data.additionalContact3Firstname,
      Additional_Contact3_LastName__c: data.additionalContact3Lastname,
      Additional_Contact3_Email__c: data.additionalContact3Email,
      Additional_Contact4_FirstName__c: data.additionalContact4Firstname,
      Additional_Contact4_LastName__c: data.additionalContact4Lastname,
      Additional_Contact4_Email__c: data.additionalContact4Email
    };

    // Step 4: Patch update
    await axios.patch(
      `${instance_url}/services/data/v58.0/sobjects/Onboarding_Form__c/${recordId}`,
      updatePayload,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Successfully updated Onboarding_Form__c record');
    res.status(200).send({ success: true });

  } catch (err) {
    console.error('❌ Error updating Salesforce:', err.response?.data || err.message);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
