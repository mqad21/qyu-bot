<template>
  <div>
    <Header />
    <b-container class="pt-4">
      <b-row class="justify-content-center">
        <b-col cols="4">
          <Connection :connection="connection" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Connection from "../components/Connection.vue";
import { WA_STATUS } from "../constants/wa.js";

export default {
  components: {
    Header,
    Connection,
  },
  data() {
    return {
      connection: {
        status: null,
        qrString: "",
      },
    };
  },
  methods: {
    getConnection() {
      this.$axios("status")
        .then((response) => response.data.data)
        .then((result) => {
          this.connection = { ...result, loading: false };
        });
    },
  },
  beforeMount() {
    this.getConnection();
  },
  mounted() {
    this.$socket.on("NEW_STATUS", (status) => {
      this.connection = { ...status, loading: false };
    });
  },
  watch: {
    connection: {
      handler(value) {
        if (value.status != WA_STATUS.DISCONNECTED) {
          this.connection.loading = false;
          this.connection.qrString = "";
        }
      },
      immediate: true,
    },
  },
};
</script>