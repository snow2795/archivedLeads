import { LightningElement, wire, api } from 'lwc';
import getArchivedLead from '@salesforce/apex/ConvertedLeadArchiver.getArchivedLead';
import getArchivedLeads from '@salesforce/apex/ConvertedLeadArchiver.getArchivedLeads';
import { getRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

const columns = [
    {
        label: '',
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'action:preview',
            title: 'Preview',
            variant: 'border-filled',
            alternativeText: 'View'
        }
    },    
    { label: 'Email', fieldName: 'Email__c', type: 'text'},
    { label: 'Id', fieldName: 'Id__c', type: 'text'}
];

export default class ArchiveLeadsListView extends LightningElement {
    @api recordId;
    @api mode = "All Archived Leads";
    @api hideHeader = false;
    columns = columns;
    archivedLeads;
    rowOffset = 0;
    showModal = false;
    showNoResults = false;
    showDataTable = false;
    accountId = '';
    contactId = '';
    leadId = '';
    
    @api refresh() {
        console.log('Refresh - ' + this.mode);
        switch(this.mode) {
            case 'All Archived Leads':
                this.getArchivedLeads();
                break;
        }    
    }

    get showHeader() {
        if (this.hideHeader == true) {
            return false;
        } else {
            return true;
        }
    }

    connectedCallback() {
        console.log('connectedCallback: ' + this.mode);
        this.refresh();
    }

    getArchivedLeads() {
        console.log('getArchivedLeads');
    
        getArchivedLeads({
            // Use this.recordId or another property if needed
            recordId: this.recordId
        })
        .then(result => {
            console.log('Result: ' + JSON.stringify(result));
            this.archivedLeads = result;
            this.showResults();
        })
        .catch(error => {
            console.log('ERROR: ' + JSON.stringify(error));
        });
    }


    handleRowAction(event) {
        console.log('handleRowAction');
        console.log('detail ='+event.detail.row.Id__c);
        console.log('detail ='+JSON.stringify(event.detail.row.Id__c));


        getArchivedLead({
            leadId: event.detail.row.Id__c
        })
        .then(result => {
            console.log('Result: ' + JSON.stringify(result));
            this.archivedLead = result;
            this.showModal = true;
        })
        .catch(error => {
            console.log('ERROR: ' + JSON.stringify(error));
        });
    }

    showResults() {
        if (this.archivedLeads.length > 0) {
            this.showDataTable = true;
        } else {
            this.showNoResults = true;
        }
    }

    closeModal() {
        this.showModal = false;
    }

}