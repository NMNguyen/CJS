<template>
    <div>
        <gantt></gantt>
    </div>
</template>

<script>
import Gantt from './gantt/main';
import Menu from './menu/main';

export default {
  name: 'Main',
  components: {
    Gantt,
      Menu,
  },
  data() {
    return {
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
