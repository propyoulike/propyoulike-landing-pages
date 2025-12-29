\# Lead Definition (Canonical)



A lead is created ONLY when all the following conditions are met:



1\. User provides valid contact information

2\. User explicitly requests contact or assistance

3\. Submission passes validation

4\. Lead is accepted and stored by the backend / CRM



Only then should the `lead\_created` event be fired.



Actions such as brochure downloads, WhatsApp clicks, or call clicks

are intent signals and must NOT be counted as leads.



