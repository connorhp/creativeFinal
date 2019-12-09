var app = new Vue({
  el: '#app',
  data: {
    title: "",
    amount: "",
    addItem: null,
    items: [],
    findTitle: "",
    findItem: null,
    total: "0",
    tax: "",
    taxTotal: "",
    price: "",
    error: false,
    errorMessage: ""
  },
  created() {
    this.getItems();
  },
  computed: {
    suggestions() {
      return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    },
  },
  methods: {
    getTotal() {
      this.total = 0;
      let size = this.items.length;
      for (let i = 0; i < size; ++i) {
        this.total += this.items[i].price * this.items[i].amount;
      }
      this.taxTotal = this.total + (this.total * (this.tax / 100));
    },
    async upload() {
      try {
        this.error = false;
        let r2 = await axios.post('/api/items', {
          title: this.title,
          amount: this.amount,
          price: this.price,
          total: this.amount * this.price
        });
        this.addItem = r2.data;
        this.getTotal();
        location.reload();
      }
      catch (error) {
        console.log(error);
        this.errorMessage = "Enter Price as a number, No Symbols";
        this.error = true;
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        this.getTotal();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async deleteItem(item) {
      try {
        console.log("ITEM_ID: " + item._id);
        let response = axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
  }
});
