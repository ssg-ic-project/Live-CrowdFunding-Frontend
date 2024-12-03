<template>
  <div>
    <canvas ref="pieChartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

export default {
  props: ["data"],
  mounted() {
    this.renderChart();
  },
  watch: {
    data() {
      this.renderChart();
    },
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.pieChartCanvas.getContext("2d");
      Chart.register(ArcElement, Tooltip, Legend);

      this.chart = new Chart(ctx, {
        type: "pie",
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 300px;
}
</style>