import { LightningElement } from 'lwc';
import callgetArchivedLeads from '@salesforce/apex/ConvertedLeadArchiver.getArchivedLeads';

export default class ArchivedLeadsTab extends LightningElement {
    showArchiveLeads = false;
    showArchiveLeadsForm = true;
    showGenerateReport = false;
    showLog = false;
    jobId;
    archiveDate = new Date().getFullYear() + '-01-01 00:00:00';
    log = '';

    openArchiveLeads() {
        this.showArchiveLeads = true;
        this.showArchiveLeadsForm = true;
        this.showLog = false;
        this.log = '';
    }

    openGenerateReport() {
        this.showGenerateReport = true;
        this.log = '';
        this.generateReport();
    }

    closeArchiveLeads() {
        this.showArchiveLeads = false;
    }

    handleArchiveDate(event) {
        this.archiveDate = event.detail.value;        
    }

    refresh() {
        console.log('Refresh');

        let archivedLeadsListView = this.template.querySelector('.archivedLeadsListView');
        archivedLeadsListView.refresh();
    }

    archiveLeads() {
        this.showLog = true;
        this.showArchiveLeadsForm = false;

        // If we're at the start of our log (this method might be called multiple times)
        if (!this.log) {
            this.addToLog('Archiving leads... (please wait)')
        }

        callArchiveLeads({
            'archiveDate': this.archiveDate
        })
        .then(result => {
            console.log(JSON.stringify(result));
            if (result == false) {
                this.archiveLeads();
                this.addToLog('Still processing...');
            } else {
                this.addToLog('Finished! You may now close this window.');
            }
            
        })
        .catch(error => {
            console.log('ERROR: ' + JSON.stringify(error));
        });
    }

    generateReport() {
        // If we're at the start of our log (this method might be called multiple times)
        if (!this.log) {
            this.addToLog('START: Executing Async SOQL')
        }
    }

    addToLog(message) {
        console.log(message);
        var today = new Date(); 
        var time = 
            (today.getHours()<10?'0':'') + today.getHours() + ':' +
            (today.getMinutes()<10?'0':'') + today.getMinutes() + ':' +
            (today.getSeconds()<10?'0':'') + today.getSeconds();

        this.log = this.log + time + ": " + message + "\n";
    }    
}