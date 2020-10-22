<template>
  <div id="home">
    <h3 class="home">组件内事件</h3>
    <section>
      <span>count: ==> {{ count }} </span>
      <button @click="increment">count++</button>
    </section>
    <h3>vuex事件</h3>
    <section>
      <p>全局 ==> {{ a }}</p>
      <p>module_1 ==> {{msg}} <button @click="fetchMsg">fetchMsg msg</button></p>
    </section>
    <h3>mock数据及http插件</h3>
    <section>
      <button @click="fetchMockTest">调用fetchMockTest获取mock数据</button>
      <p>mockData ==> {{mockData || '- -'}}</p>
    </section>
    <h3>{{ syncedNameData }}</h3>
    <Test :propA="555" :propB="count" :propC="msg" :syncedName.sync="syncedNameData"/>
  </div>
</template>

<script lang="ts">
// import Vue from 'vue'; /// https://vuejs.org/v2/api
// import { mapState } from 'vuex'; /// https://github.com/ktsn/vuex-class/
// import Component from 'vue-class-component'; /// https://class-component.vuejs.org/
import { Vue, Component, Emit, Watch, Prop } from 'vue-property-decorator'; /// https://github.com/kaorun343/vue-property-decorator
import {
    State,
    Getter,
    Action,
    Mutation,
    namespace
} from 'vuex-class';
import api from '../api/fetchTest';
import Test from './test.vue';

const someModule = namespace('module_1');

@Component({
    name: 'home',
    components: {
        Test
    }
})
export default class Home extends Vue {
  // Class properties will be component data
  @State a: number;

  @someModule.State msg: string;

  @someModule.Action fetchMsg : Function;

  count: number = 0;

  // eslint-disable-next-line class-methods-use-this
  data(): object {
      return {
          mockData: '- -',
          syncedNameData: '同步'
      };
  }

  /* data() {
    return {
      count: 0
    }
  } */
  // Methods will be component methods
  increment():void {
      this.count++;
  }

  decrement():void {
      this.count--;
  }

  @Watch('mockData', { immediate: true, deep: true })
  onChangeValue(newVal: string, oldVal: string) {
      console.log(newVal, oldVal);
  }

  mounted(): void {
      // console.log('mounted');
      this.$on('emit-todo', (n:string) => {
          console.log(n);
      });
  }

  @Emit()
  emitTodo(n: string) {
      console.log('hello');
  }

  fetchMockTest(): void {
      api.fetchMockTest().then((r: object): void => {
          this.$data.mockData = JSON.stringify(r, null, 2);
      });
  }
}

/* export default Vue.extend({ // 这中写法为未来3.X版本的defineComponent书写方式，目前2.X版本仅有IDE类型提示，无类型约束
    data() {
        return {
            count: 0
        };
    },
    methods: {
        increment() {
            this.count = '';
        },
        decrement() {
            this.count--;
        }
    },
    computed: {
        ...mapState(['a'])
    }
}); */
</script>

<style scoped>
#home, .home {
  color: red;
}
</style>
