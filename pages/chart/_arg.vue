<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header card-header-primary">
            <h4 class="card-title">アクセス数・購入件数（{{ argument_data }}）</h4>
            <p class="card-category">条件：期間（{{ sdate }} ～ {{ edate }}）</p>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <div id="slc"></div>
                <nuxt-link :to="{ name: 'index', query: { sdate: sdate, edate: edate } }"><button type="button" class="btn btn-default pull-right"><i class="material-icons">skip_previous</i> 戻る<div class="ripple-container"></div></button></nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Plotly from 'plotly.js-basic-dist'

export default {

  data() {
    return {
      sdate: this.$route.query.sdate,
      edate: this.$route.query.edate,
      argument_data: this.$route.params.arg,
    }
  },

  async asyncData(context) {
    const argument_id = context.store.state.affiliate.argument_id;
    const summery = await context.$axios.$get(`/api/getAccessCountDaily.php?argument_id=${argument_id}&argument_data=${context.params.arg}&sdate=${context.query.sdate}&edate=${context.query.edate}`)
    let datac = []
    let datas = []
    let dates = []
    for (let key in summery) {
      datac.push(summery[key]['click'])
      datas.push(summery[key]['sales'])
      dates.push(key.replace(/-/g, '/'))
    }
    return { click: datac, sales: datas, labels: dates }
  },

  mounted() {
    let clickcount = {
      x: this.labels,
      y: this.click,
      name: 'クリック件数',
      hovertext: "",
      hovertemplate: "%{y:.f}件<extra></extra>",
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        color: '#ff1493'
      }
    };

    let purchase = {
      x: this.labels,
      y: this.sales,
      name: '購入件数',
      hovertemplate: "%{y}件",
      type: 'bar',
      yaxis: 'y2',
      width: 0.5,
      marker: {
        color: '#90ee90'
      }
    };

    const layout = {
      hovermode:'closest',
      title: `クリック・購入件数（${this.argument_data}）`,
      xaxis: {
        tickmode: "linear",
        tick0: 1,
        dtick: 1,
      },
      yaxis: {
        title: 'クリック',
        overlaying: 'y2',
        tickformat: ".f"
      },
      yaxis2: {
        title: '購入',
        side: 'right'
      }
    };

    const config = {
      responsive: true,
      displaylogo: false,
      //displayModeBar: false,
      toImageButtonOptions: {
        format: 'svg',
        filename: 'access_analysis',
        scale: 1
      },
    }

    Plotly.newPlot('slc', [clickcount, purchase], layout, config)

    let slcPlot = document.getElementById('slc')
    slcPlot.on('plotly_hover', function(data){
      console.log("Hover Point X:" + data.points[0].x)
    })
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
</style>
