document.addEventListener("alpine:init", () => {
    Alpine.data('price_plan', () => ({
        title: 'Phone Bill',
        plans: [], 
        showPlans: false,
        totalBill: '0.00',
        showResults: false,
        pricePlans: [],
        selectedPlan: '',
        actions: '',
        newPlanName: '',
        newCallCost: '',
        newSmsCost: '',
        successMessage: '',
        callCost: '', 
        smsCost: '', 
        successUpdateMessage: '',
        selectedId: '', 
  
        getPricePlans() {
            axios.get('http://localhost:4011/api/price_plans/')
                .then(response => {
                    this.plans = response.data; 
                    this.pricePlans = response.data;
                    this.showPlans = true; 
                })
        },
  
        calculateTotalBill() {
          if (this.selectedPlan && this.actions) {
              axios.post('http://localhost:4011/api/phonebill/', {
                  price_plan: this.selectedPlan,
                  actions: this.actions
              })
              .then(response => {
                  this.totalBill = response.data.total;
                  this.showResults = true;
  
                  setTimeout(() => {
                      this.showResults = false;
                      this.totalBill = '0.00'; 
                      this.actions = '';
                      this.selectedPlan = '';
                  }, 4000); 
              })
              .catch(error => {
                  console.error('Error calculating total bill:', error);
              });
          } else {
              alert('Please select a price plan and enter actions.');
          }
      },
  
      createPricePlan() {
        if (this.newPlanName && this.newCallCost && this.newSmsCost) {
            axios.post('http://localhost:4011/api/price_plan/create', {
                name: this.newPlanName,
                call_cost: parseFloat(this.newCallCost),
                sms_cost: parseFloat(this.newSmsCost)
            })
            .then(response => {
                if (response.data.status === "Success") {
                    this.successMessage = `Price plan ${this.newPlanName} is added into the database.`;
                    alert(this.successMessage);
                    this.getPricePlans();
    
                    this.newPlanName = '';
                    this.newCallCost = '';
                    this.newSmsCost = '';
  
                    setTimeout(() => {
                        this.successMessage = '';
                    }, 4000); 
                }
            })
            .catch(error => {
                console.error('Error creating price plan:', error);
            });
        } else {
            alert('Please fill in all fields.');
        }
    },
    
    fillPlanDetails() {
      const selected = this.pricePlans.find(plan => plan.name === this.selectedPlan);
      if (selected) {
          this.callCost = selected.call_price;
          this.smsCost = selected.sms_price;
      }
  },
  
  updatePricePlan() {
      if (this.selectedPlan && this.callCost && this.smsCost) {
          axios.post('http://localhost:4011/api/price_plan/update', {
              name: this.selectedPlan,
              call_cost: parseFloat(this.callCost),
              sms_cost: parseFloat(this.smsCost)
          })
          .then(response => {
              if (response.data.status === "Success") {
                  this.successUpdateMessage = `Price plan ${this.selectedPlan} updated successfully.`;
                  alert(this.successUpdateMessage);
                
                  setTimeout(() => {
                      this.successUpdateMessage = '';
                  }, 4000);
                  
                  this.getPricePlans();
              }
          })
          .catch(error => {
              console.error('Error updating price plan:', error);
          });
      } else {
          alert('Please fill in all fields.');
      }
  },
  
  deletePlan() {
    if (this.selectedId) {
        axios.post('http://localhost:4011/api/price_plan/delete', {
            id: this.selectedId
        })
        .then(response => {
            if (response.data.status === "Success") {
                alert(`Price plan with ID ${this.selectedId} has been successfully deleted.`);
                this.getPricePlans();
                this.selectedId = '';
            }
        })
        .catch(error => {
            console.error('Error deleting price plan:', error);
        });
    } else {
        alert('Please select a price plan ID to delete.');
    }
  },
  
      init() {
        this.getPricePlans(); 
      }
    }));
  });
  