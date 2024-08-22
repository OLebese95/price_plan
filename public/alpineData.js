document.addEventListener("alpine:init", () => {
    Alpine.data('pricePlan', () => ({
      title: 'Price Plans',
      usage: '',
      totalBill: '0.00',
      showPrices: false,
      // prices: [],
      prices: { call: 0, sms: 0 }, 
      priceType: 'call', 
      priceSet: '', 
      status: '',
      message: '',
      showResults: false,
      showResults2: false,
      sentence: '',
      shortestWord: '',
      longestWord: '',
      sum: 0,
      available: '',
      usage2: '',
      result: '',

      calculateBill() {
        axios.post(`http://localhost:4011/api/phonebill/total`, {
          total: this.usage
        })
        .then(response => {
          this.totalBill = response.data.bill;
          this.showResults2 = true;
        })
        .then(() => {
          setTimeout(() => {
            this.usage = '';
            this.totalBill = '0.00';
            this.showResults2 = false;
          }, 5000)
        })
      
      },

      getPrices() {
        axios.get(`http://localhost:4011/api/phonebill/prices`)
        .then(response => {
          this.prices = response.data;
        })
      },

      setPrice() {
        if (!this.priceSet || isNaN(this.priceSet)) {
            alert("Please enter an amount");
            return;
        }

        axios.post(`http://localhost:4011/api/phonebill/price`, {
            type: this.priceType,
            price: this.priceSet
        })
        .then(response => {
            this.status = response.data.status;
            this.message = response.data.message;
            alert(this.status);
        })
        .then(() => {
          setTimeout(() => {
            this.priceSet = '';
            this.status = '';
            this.message = '';
          }, 5000)
        })
    },
    wordGames() {
      if (!this.sentence.trim()) {
          alert("Please enter a sentence!");
          return;
      }

      axios.get(`http://localhost:4011/api/word_game`, {
          params: {
              sentence: this.sentence
          }
      })
      .then(response => {
          this.shortestWord = response.data.shortestWord;
          this.longestWord = response.data.longestWord;
          this.sum = response.data.sum;
          this.showResults = true;
      })
      .then(() => {
        setTimeout(() => {
          this.sentence = '';
          this.shortestWord = '';
          this.longestWord = '';
          this.sum = 0;
          this.showResults = false;
        }, 5000)
      })
  },
  enoughAirtime() {
    if (!this.available || isNaN(this.available)) {
      alert("Please enter a valid amount for available airtime");
      return;
    }

    axios.post(`http://localhost:4011/api/enough`, {
      usage: this.usage2,
      available: parseFloat(this.available)
    })
    .then(response => {
      this.result = response.data.result;

    
      const remainingAirtime = parseFloat(this.result.replace('R', ''));

      if (remainingAirtime <= 0) {
        alert("You no longer have money.");
      }
    });

    setTimeout(() => {
      this.usage2 = '';
      this.available = '';
      this.result = '';
    }, 5000);
  },




    }));
  });
