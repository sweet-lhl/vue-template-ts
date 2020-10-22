<template>
  <div id="wrap-entry">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
    name: 'wrap-entry'
})
export default class Main extends Vue {

}
</script>

<style scoped>

</style>
