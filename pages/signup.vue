<template>
  <div>
    <section class="section no-top-pad">
      <h5 class="title is-5">Signup</h5><hr>
      <div class="columns is-centered is-mobile">
        <div class="column is-half-desktop is-full-mobile is-full-tablet">
            <form @submit.prevent="onSignUp">
              <div class="field">
                <label class="label">Name</label>
                <div class="control">
                  <input class="input" type="text" name="fullName" v-model="fullName" v-validate="'required|min:4'" :class="{'is-danger': errors.has('name')}">
                  <p v-show="errors.has('name')" class="help is-danger">{{ errors.first('fullName')}}</p>
                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="text" name="email" v-model="email" v-validate="'required|email'" :class="{'is-danger': errors.has('email')}">
                  <p v-show="errors.has('email')" class="help is-danger">{{ errors.first('email')}}</p>
                </div>
              </div>
              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input class="input" type="password" name="password" v-model="password" v-validate="'required|min:4'" :class="{'is-danger': errors.has('password')}">
                  <p v-show="errors.has('password')" class="help is-danger">{{ errors.first('password')}}</p>
                </div>
              </div>

              <error-bar :error="error"></error-bar>

              <div class="field">
                <div class="control">
                  <button class="button is-primary" :class="{'is-loading': busy}" :disabled="busy">Signup</button>
                </div>
              </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ErrorBar from '@/components/ErrorBar'
import apiJobMixin from '@/mixins/apiJobMixin'

export default {
  components: {
    ErrorBar: ErrorBar
  },
  mixins: [apiJobMixin],
  data() {
    return {
      fullName: '',
      email: '',
      password: ''
    }
  },
  methods: {
    onSignUp() {
      this.$validator.validateAll().then(result => {
        if (result) {
          const signUpData = {
            fullName: this.fullName,
            email: this.email,
            password: this.password
          }
          this.$store.dispatch('signUpUser', signUpData)
        }
      })
    }
  }
}
</script>
