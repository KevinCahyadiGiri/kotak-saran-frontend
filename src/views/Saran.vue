<template>
  <v-app>
    <div v-if="forbiddenAccessScreen" class="forbiddenAccessScreenContainer">
      <div class="alertDoneBuatSaran" style="background-color: #ea463a; color: #101424">
        <div>
          Please login first
        </div>  
        <div>
          You will be redirected to login page soon...
        </div>
      </div>
    </div>
    <v-app-bar class="welcomeBanner" elevation=5>
      <div>
        <div class="bannerTitle">Kotak Saran ITB</div>
        <div class="bannerUser">Hi, {{user.name}}</div>
      </div>
      <div class="bannerSignOut">
        <v-btn class="signOutText" @click="signOutClicked()">Sign Out</v-btn>
      </div>
    </v-app-bar>
    <v-container fluid fill-height class="pad-ver-0">
      <v-layout row wrap>
        <v-flex xs3 class="menuArea">
          <div v-for="page in pages" :key="page.name">
            <div class="optionButton" :style="page.name === onPage ? 'background-color: #ffffff':''" @click="menuClicked(page.name)">{{ page.name }}</div>
          </div>
        </v-flex>
        <v-flex xs9>
          <v-container v-if="onPage === 'Semua saran'">
            <div v-for="saran in dataSaran" :key="saran.saranId" class="cardSaranContainer">
              <v-card>
                <v-card-title>{{ saran.title }}</v-card-title>
                <v-card-subtitle>{{ saran.description }}</v-card-subtitle>
              </v-card>
            </div>
          </v-container>
          <v-container v-else-if="onPage === 'Buat saran'">
            <div class="commandToWriteSaran">Silahkan tulis aspirasimu pada form dibawah</div>
            <div class="commandToWriteSaran">Semoga aspirasi ini dapat memberikan manfaat pada ITB</div>
            <div class="inputSaranContainer">
              <v-text-field label="Judul" outlined v-model="buatSaran[0].value"></v-text-field>
              <v-textarea label="Deskripsi" outlined v-model="buatSaran[1].value"></v-textarea>
              <div class="kirimSaranButtonContainer">
                <v-btn class="signOutText kirimSaranButton" @click="kirimSaranButtonClicked()">Kirim</v-btn>
              </div>
            </div>
            <div v-if="alertDoneBuatSaran" class="alertDoneBuatSaran">Aspirasimu telah terkirim. Terima kasih :)</div>
          </v-container>
          <v-container v-else-if="onPage === 'Edit saran'">
            <div v-for="saranku in dataSaranku" :key="saranku.saranId" class="cardSaranContainer">
              <v-card>
                <v-card-title>{{ saranku.title }}</v-card-title>
                <v-card-subtitle>{{ saranku.description }}</v-card-subtitle>
                <div class="editDeleteButtonContainer">
                  <v-btn icon>
                    <v-icon color="green" @click="editCardClicked(saranku.saranid, 'edit')">mdi-lead-pencil</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon color="red" @click="editCardClicked(saranku.saranid, 'delete')">mdi-trash-can</v-icon>
                  </v-btn>
                </div>
              </v-card>
              <v-navigation-drawer v-model="onPageEdit.pageNumber" v-if="onPageEdit.pageNumber === saranku.saranid" absolute temporary right width="50%" style="min-width: 300px">
                <div v-if="onPageEdit.option === 'edit'">
                  <div class="commandEditText">Edit saranmu disini</div>
                  <div class="inputSaranContainer">
                    <v-text-field label='Judul' v-model="dataSaranEdit.title" outlined></v-text-field>
                    <v-textarea label='Deskripsi' v-model="dataSaranEdit.description" outlined></v-textarea>
                    <div class="kirimSaranButtonContainer">
                      <v-btn class="signOutText kirimSaranButton" @click="editSaranButtonClicked(saranku.saranid)">Ubah</v-btn>
                    </div>
                  </div>
                </div>
                <div v-else-if="onPageEdit.option === 'delete'">
                  <div class="commandEditText">Apa kamu yakin ingin menghapus saranmu ini?</div>
                  <div class="inputSaranContainer">
                    <v-text-field label='Judul' readonly :value="saranku.title" outlined></v-text-field>
                    <v-textarea label='Deskripsi' readonly :value="saranku.description" outlined></v-textarea>
                    <div class="kirimSaranButtonContainer">
                      <v-btn class="signOutText hapusSaranButton" @click="hapusSaranButtonClicked(saranku.saranid)">Hapus</v-btn>
                    </div>
                  </div>
                </div>
              </v-navigation-drawer>
            </div>
          </v-container>
          <v-container v-else>wrong page</v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    user: null,
    config: null,
    onPage: 'Semua saran',
    onPageEdit: {
      option: null,
      pageNumber: false
    },
    pages: [
      {name: 'Semua saran'},
      {name: 'Buat saran'},
      {name: 'Edit saran'}
    ],
    dataSaran: [],
    dataSaranku: [],
    dataSaranEdit: {
      title: null,
      description: null
    },
    buatSaran: [
      {name: 'Judul', value: null},
      {name: 'Deskripsi', value: null}
    ],
    alertDoneBuatSaran: false,
    forbiddenAccessScreen: false
  }),
  methods: {
    menuClicked(menuName) {
      this.onPage = menuName
    },
    async kirimSaranButtonClicked() {
      await this.$axios.post('saran', {
        title: this.buatSaran[0].value,
        description: this.buatSaran[1].value
      }, this.config)
      .then(() => {
        console.log('berhasil bikin saran');
        this.buatSaran[0].value = null;
        this.buatSaran[1].value = null;
        this.alertDoneBuatSaran = true;
        this.refreshDataSaran();
      }).catch((err) => {
        console.log(err)
      });
    },
    refreshDataSaran() {
      this.$axios.get('saran', this.config)
        .then((res) => {
          this.dataSaran = res.data.dataSaran;
          this.forbiddenAccessScreen = false;
        })
        .catch(async (err) => {
          console.log(err);
          if (err.message === "Request failed with status code 403") {
            this.forbiddenAccessScreen = true;
            await new Promise((r) => setTimeout(r, 3000));
            this.$router.push({name: 'Home'})
          }
        }
      )
    },
    editCardClicked(saranId, option) {
      var saranClicked = this.dataSaran.filter(val => {return val.saranid === saranId})[0]
      this.dataSaranEdit.title = saranClicked.title;
      this.dataSaranEdit.description = saranClicked.description;
      this.onPageEdit.pageNumber = saranId;
      this.onPageEdit.option = option;
    },
    async hapusSaranButtonClicked(saranId) {
      await this.$axios.delete(`saran/${saranId}`, this.config)
      .then(async () => {
        await this.refreshDataSaran();
        this.onPageEdit.pageNumber = false
      })
      .catch(err => {console.log(err)})
    },
    async editSaranButtonClicked(saranId) {
      await this.$axios.put(`saran/${saranId}`,{
        title: this.dataSaranEdit.title,
        description: this.dataSaranEdit.description    
      }, this.config)
      .then(async () => {
        await this.refreshDataSaran();
        this.onPageEdit.pageNumber = false
      })
      .catch(err => {console.log(err)})
    },
    signOutClicked() {
      this.user = null,
      this.$store.commit('setUser', {
        uid: null, name: null, email: null
      })
      this.$router.push({name: 'Home'})
    }
  },
  async created() {
    this.user = await this.$store.getters.getUser;
    this.config = await {
      headers: {
        Authorization: `Bearer ${this.user.uid}`
        // Authorization: `Bearer 98327`
      }
    }
    await this.refreshDataSaran();
    console.log(this.user.uid);
  },
  watch: {
    alertDoneBuatSaran: async function()  {
      await new Promise((r) => setTimeout(r, 3000));
      this.alertDoneBuatSaran = false
    },
    dataSaran: function() {
      this.dataSaranku = this.dataSaran.filter(val => {return val.uid == this.user.uid})
    }
  }
}
</script>

<style>
.welcomeBanner {
  background-color: #a0b0d0 !important;
}
.bannerTitle {
  font-weight: bold;
  font-size: 20px;
  color: #101424;
}
.bannerUser {
  font-size: 15px;
  color: #101424;
}
.bannerSignOut {
  position: absolute;
  right: 20px;
}
.signOutText {
  text-transform: capitalize !important;
}
.menuArea {
  background-color: #afddd0;
}
.cardSaranContainer {
  margin: 20px 0;
  width: 80%;
  margin-left: 10%;
}
.commandToWriteSaran {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
.inputSaranContainer {
  width: 80%;
  margin-left: 10%;
  margin-top: 30px;
}
.kirimSaranButtonContainer {
  display: flex;
  justify-content: flex-end;
}
.kirimSaranButton {
  background-color: #101424 !important;
  color: #ffffff !important;
}
.hapusSaranButton {
  background-color: #ea463a !important;
  color: #ffffff !important;
}
.alertDoneBuatSaran {
  background-color: #afddd0;
  width: 80%;
  margin-left: 10%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
  color: #4b5ea6;
  text-align: center;
}
.editDeleteButtonContainer {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}
.commandEditText {
  font-weight: bold;
  text-align: center;
  font-size: 20px;
  margin-top: 20px;
}
.pad-ver-0 {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.optionButton {
  padding: 20px;
  cursor: pointer;
}
.optionButton:hover {
  background-color: #a0b0d0;
}
.forbiddenAccessScreenContainer {
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: 11;
  background-color: black;
  opacity: 0.8;
}
</style>