import { LightningElement, api } from 'lwc';
import archiveConvertedLeads from '@salesforce/apex/ConvertedLeadArchiver.archiveConvertedLeads';;

export default class ArchiveLeads extends LightningElement {
    @api recordId;
    @api mode = "All Archived Leads";
    archiveDate; // Property to hold the date input by the user

    showArchive = true;
    showSuccess = false;

    handleDateChange(event) {
        // When the user selects a date, update the archiveDate property
        this.archiveDate = event.target.value;
    }

    archiveClick() {
        if (!this.archiveDate) {
            // Handle the case where no date is selected
            alert('Please select a date.');
            return;
        }

        // Call the updated Apex method
        archiveConvertedLeads({ archiveDate: this.archiveDate })
        .then(result => {
            // Handle success
            alert('Leads archived successfully.');
        })
        .catch(error => {
            // Handle error
            console.error('Error archiving leads: ' + JSON.stringify(error));
            alert('Error in archiving leads.');
            });
    }
}

