<template>
  <v-app app dark>
    <v-navigation-drawer app v-model="drawer" mobile-break-point="650">
    <v-list subheader>
      <v-subheader>People in the room</v-subheader>

      <v-list-item
        v-for="u in users"
        :key="u.id"
        @click.prevent
      >
        <!-- <v-list-item-avatar>
          <v-img :src="item.avatar"></v-img>
        </v-list-item-avatar> -->

        <v-list-item-content>
          <v-list-item-title >{{u.name}}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon :color="u.id === user.id ? 'primary' : 'grey'">mdi-antenna</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    
    
    </v-navigation-drawer>
    <v-app-bar app>
      <v-btn icon @click="drawer = !drawer"> 
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </v-btn>
      <v-btn icon @click="exit"> 
        <v-icon class="icons">mdi-arrow-left</v-icon>
      </v-btn>
      
      <v-toolbar-title>Chat room {{user.room}} </v-toolbar-title>
    </v-app-bar>
    <v-content>
      <div style="height: 100%">
        <nuxt/>
      </div>
      
    </v-content>
  </v-app>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
export default {
  data : () => ({
    drawer: true
  }),

  computed: mapState(["user", "users"]),
  methods: {
    ...mapMutations(['clearData']),
    exit() {
      this.$socket.emit('userLeft', this.user.id, () => {
        this.$router.push('/?message=leftChat')
        this.clearData();
      })
    }
  }
}
</script>
<style>

</style>