<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header card-header-primary">
            <h4 class="card-title">検索条件の入力</h4>
            <p class="card-category">期間指定や遷移元の値でデータを絞り込みます</p>
          </div>
          <div class="card-body">
            <form @submit.prevent>
              <div class="row">
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">期間（from）</label>
                    <input
                      type="date"
                      name="sdate"
                      v-model="sdate"
                      class="form-control"
                      placeholder="例：2021/01/01"
                    >
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">期間（to）</label>
                    <input
                      type="date"
                      name="edate"
                      v-model="edate"
                      class="form-control"
                      placeholder="例：2021/01/31"
                    >
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label class="bmd-label-floating">遷移元値</label>
                    <input
                      type="text"
                      name="argument_data"
                      v-model="argument_data"
                      class="form-control"
                      placeholder="例：mail0101"
                    >
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-warning pull-right" @click="getList"><i class="material-icons">search</i> 検索</button>
              <div class="clearfix"></div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="card">
          <div class="card-header card-header-primary">
            <h4 class="card-title">検索結果</h4>
            <p class="card-category">条件：期間（{{ sdate }} ～ {{ edate }}）</p>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table" v-show="!loading">
                <thead class=" text-primary">
                  <tr>
                    <th>遷移元値</th>
                    <th v-show="$store.state.affiliate.charge_flg > 0">売上</th>
                    <th v-show="$store.state.affiliate.charge_flg > 0">消費税</th>
                    <th v-show="$store.state.affiliate.charge_flg > 0">送料</th>
                    <th v-show="$store.state.affiliate.charge_flg > 0">代引手数料</th>
                    <th v-show="$store.state.affiliate.charge_flg > 0">実売上</th>
                    <th>クリック数</th>
                    <th>CV率</th>
                    <th>注文数</th>
                    <th v-show="$store.state.affiliate.charge_flg > 0">購入単価</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sale, arg) in sales" v-bind:key="arg">
                    <td class="cell">{{ arg }}&nbsp;<nuxt-link :to="{ name: 'chart-arg', params: { arg: arg }, query: { sdate: sdate, edate: edate } }"><i class="material-icons">analytics</i></nuxt-link></td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ sale.real_price | addComma }}</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ sale.tax | addComma }}</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ sale.mailing_cost | addComma }}</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ sale.commission_charge | addComma }}</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ sale.total_price | addComma }}</td>
                    <td class="digit">{{ sale.click_count | addComma }}</td>
                    <td class="digit">{{ sale.cv | addComma }}</td>
                    <td class="digit">{{ sale.purchase_count | addComma }}</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ sale.unit | addComma }}</td>
                  </tr>
                  <tr class="sum">
                    <td class="digit">合計</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ real_price | addComma }}</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ tax | addComma }}</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ mailing_cost | addComma }}</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ commission_charge | addComma }}</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ total_price | addComma }}</td>
                    <td class="digit">{{ click_count | addComma }}</td>
                    <td class="digit">{{ cv | addComma }}</td>
                    <td class="digit">{{ purchase_count | addComma }}</td>
                    <td class="digit" v-show="$store.state.affiliate.charge_flg > 0">￥{{ unit | addComma }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="loader" v-show="loading">Now loading...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
const now = moment()
const today = now.format('YYYY-MM-DD');
const last_week = now.subtract(1, 'month').format('YYYY-MM-DD');

export default {
  data() {
    return {
      sales: [],
      purchase_count: 0,
      mailing_cost: 0,
      commission_charge: 0,
      card_charge: 0,
      discount_price: 0,
      total_price: 0,
      goods_count: 0,
      goods_price: 0,
      real_price: 0,
      click_count: 0,
      tax: 0,
      cv: 0,
      unit: 0,
      sdate: this.$route.query.sdate || last_week,
      edate: this.$route.query.edate || today,
      argument_data: "",
      loading: false
    }
  },
  filters: {
    addComma(value) {
      if (!value) {
        return 0;
      } else {
        return value.toLocaleString();
      }
    }
  },
  methods: {
    async getList() {
      this.loading = true;
      this.$axios.$get("/api/getAccessCount.php", {
        params: {
          argument_id: this.$store.state.affiliate.argument_id,
          sdate: this.sdate,
          edate: this.edate,
          argument_data: this.argument_data,
          login_pass: this.$store.state.affiliate.login_pass,
        }
      }).then(data => {
        setTimeout(() => {
          this.sales = data.sales;
          this.purchase_count = data.total.purchase_count;
          this.mailing_cost = data.total.mailing_cost;
          this.commission_charge = data.total.commission_charge;
          this.card_charge = data.total.card_charge;
          this.discount_price = data.total.discount_price;
          this.total_price = data.total.total_price;
          this.goods_count = data.total.goods_count;
          this.goods_price = data.total.goods_price;
          this.real_price = data.total.real_price;
          this.click_count = data.total.click_count;
          this.tax = data.total.tax;
          this.cv = data.total.cv;
          this.unit = data.total.unit;
          this.loading = false;
        }, 500)
      })
    },
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped>
  .cell {
    text-align: left;
    border-right: 1px solid #ddd;
  }
  .digit {
    text-align: right;
    border-right: 1px solid #ddd;
  }
  .sum {
    background: #ffe;
    font-weight: bold;
  }
  tbody {
    border: 1px solid #ddd;
  }

  .loader,
  .loader:after {
    border-radius: 50%;
    width: 10em;
    height: 10em;
  }

  .loader {
    margin: 60px auto;
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    border-top: 1.1em solid rgba(0, 0, 0, 0.2);
    border-right: 1.1em solid rgba(0, 0, 0, 0.2);
    border-bottom: 1.1em solid rgba(0, 0, 0, 0.2);
    border-left: 1.1em solid #000000;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
  }

  @-webkit-keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
}

</style>
