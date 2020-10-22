<template>
  <div class="test">
    <section class="ss">
      <button @click="fetchMockTest">调mock数据</button>
      <p>mockData ==> {{mockData || '- -'}}</p>
    </section>
    <section class="ss">
      <p>==> {{propA}}==> {{propB}}==> {{propC}}==> {{syncedName}}==> {{syncedNameData}}</p>
    </section>
    <van-cell-group>
      <van-cell title="单元格" value="内容"></van-cell>
      <van-cell title="单元格" value="内容"></van-cell>
    </van-cell-group>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import {
    namespace
} from 'vuex-class';
import api from '../api/fetchTest';

const someModule = namespace('module_1');

@Component({
    name: 'test'
})
export default class Test extends Vue {
  @Prop(Number) propA!: number;

  @Prop({ default: 'default value' }) propB!: string;

  @Prop([String, Boolean]) propC: string | boolean;

  @PropSync('syncedName', { type: String }) syncedNameData!: string

  data(): object {
      return {
          mockData: '- -'
      };
  }

  mounted(): void {
      console.log('syncedNameData', this.syncedNameData);
      setTimeout(() => {
          this.syncedData();
      }, 2000);
  }

  syncedData(): void {
      this.syncedNameData = '改变';
  }

  fetchMockTest(): void {
      api.fetchMockPing().then((r: object): void => {
          this.$data.mockData = JSON.stringify(r, null, 2);
      });
  }
}
</script>

<style scoped>
.ss{
  margin: 20px;
}
</style>
