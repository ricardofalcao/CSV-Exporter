<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card
            elevation="2"
        >

          <v-card-title>
            CSV Exporter
          </v-card-title>

          <v-card-subtitle>
            Convert CSV files through a scriptable template <br/>
            You can loop through the <span class="font-italic">rows</span> variable, and access each column by numerical index (starting with 0) <br/>
            For more information on the scripting syntax, access <a href="https://handlebarsjs.com/guide/builtin-helpers.html" target="_blank">here</a>
          </v-card-subtitle>

          <v-card-text>

            <v-form
                v-model="valid"
            >

              <v-file-input
                  v-model="inputFile"
                  :rules="[v => !!v || 'CSV file is required']"

                  accept="text/csv"

                  truncate-length="15"
                  label="Import CSV"
              ></v-file-input>

              <v-textarea
                  v-model="template"
                  label="Template"

                  :error="error"
                  :error-messages="errorMessages"
              ></v-textarea>

              <v-select
                  :items="[
                                            { name: 'Latex', extension: 'tex' },
                                            { name: 'Text', extension: 'txt' },
                                            { name: 'CSV', extension: 'csv' },
                                        ]"
                  v-model="extension"
                  item-text="name"
                  item-value="extension"

                  label="Extension"
              ></v-select>

            </v-form>

          </v-card-text>

          <v-card-actions>
            <v-btn
                :disabled="processing"
                type="submit"
                color="primary"
                outlined

                @click="exportCSV"
            >
              EXPORT
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import * as Papa from 'papaparse'
import * as Handlebars from 'handlebars'

export default {
  name: 'App',

  data() {
    return {
      valid: false,
      processing: false,

      inputFile: {},
      rows: [],

      template: '',
      extension: 'tex',

      error: false,
      errorMessages: []
    }
  },

  watch: {
    inputFile(file) {
      this.loadCSV(file)
    }
  },

  methods: {
    loadCSV(file) {
      this.processing = true

      const t = this

      Papa.parse(file, {
        worker: true,
        complete(results) {
          t.rows = results.data
          t.processing = false
        }
      })
    },

    async exportCSV() {
      if (!this.valid) {
        return;
      }

      this.processing = true;

      try {
        this.error = false
        this.errorMessages = []

        let filename = this.inputFile.name
        filename = filename.substring(0, filename.indexOf('.'))

        const template = Handlebars.compile(this.template);
        const text = template({rows: this.rows});

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', `${filename}.${this.extension}`);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      } catch(e) {
        this.error = true
        this.errorMessages = [e.toString()]
      }

      this.processing = false;
    }
  }
};
</script>