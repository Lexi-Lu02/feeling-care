<template>
  <div class="interactive-table-container">
    <!-- Global Search Input -->
    <div class="table-controls">
      <input
        type="text"
        v-model="globalSearchTerm"
        placeholder="Search all columns..."
        class="form-control global-search-input"
      />
    </div>

    <table
      v-if="data && columns && data.length > 0 && columns.length > 0"
      class="interactive-table"
      :key="`table-${data?.length || 0}-${columns?.length || 0}`"
    >
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            @click="toggleSort(col.key)"
            :class="{ sortable: col.sortable }"
          >
            {{ col.label }}
            <span v-if="sortColumn === col.key">
              <i :class="['fas', sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down']"></i>
            </span>
            <span v-else-if="col.sortable"><i class="fas fa-sort"></i></span>
          </th>
        </tr>
        <!-- Individual Column Search Row -->
        <tr class="column-search-row">
          <th v-for="col in columns" :key="col.key">
            <input
              v-if="col.searchable"
              type="text"
              v-model="columnSearchTerms[col.key]"
              :placeholder="`Search ${col.label}`"
              class="form-control column-search-input"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in paginatedData"
          :key="item?.id || `row-${index}`"
          @click="handleRowClick(item)"
          class="table-row-clickable"
        >
          <td v-for="col in columns" :key="col.key">
            <span v-if="col.type === 'date'">{{ formatDate(item?.[col.key]) }}</span>
            <span v-else-if="col.type === 'time'">{{ formatTime(item?.[col.key]) }}</span>
            <span v-else>{{ item?.[col.key] || '' }}</span>
          </td>
        </tr>
        <tr v-if="paginatedData.length === 0">
          <td :colspan="columns.length" class="no-data">No data found.</td>
        </tr>
      </tbody>
    </table>

    <!-- Fallback when table can't render -->
    <div v-else class="table-fallback">
      <p>Loading table data...</p>
    </div>

    <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-outline-primary">
        <i class="fas fa-chevron-left me-1"></i>Previous
      </button>
      <span class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }} ({{ filteredData.length }} total items)
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="btn btn-outline-primary"
      >
        Next<i class="fas fa-chevron-right ms-1"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onErrorCaptured } from 'vue'

export default {
  name: 'InteractiveTable',
  props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },
  emits: ['row-click'],
  setup(props, { emit }) {
    // Error boundary to catch and handle errors
    onErrorCaptured((error, instance, info) => {
      console.error('InteractiveTable error:', error, info)
      // Prevent error from propagating
      return false
    })
    const currentPage = ref(1)
    const rowsPerPage = 10 // Fixed as per BR requirement
    const sortColumn = ref(null)
    const sortDirection = ref('asc')
    const globalSearchTerm = ref('')
    const columnSearchTerms = ref({})

    // Initialize column search terms
    props.columns.forEach((col) => {
      if (col.searchable) {
        columnSearchTerms.value[col.key] = ''
      }
    })

    // Filter data based on global and column-specific search terms
    const filteredData = computed(() => {
      try {
        if (!props.data || !Array.isArray(props.data)) {
          return []
        }

        let result = [...props.data]

        // Global search
        if (globalSearchTerm.value) {
          const term = globalSearchTerm.value.toLowerCase()
          result = result.filter((item) =>
            props.columns.some(
              (col) => col.searchable && item && String(item[col.key]).toLowerCase().includes(term),
            ),
          )
        }

        // Individual column search
        for (const key in columnSearchTerms.value) {
          const colTerm = columnSearchTerms.value[key].toLowerCase()
          if (colTerm) {
            result = result.filter(
              (item) => item && String(item[key]).toLowerCase().includes(colTerm),
            )
          }
        }
        return result
      } catch (error) {
        console.error('Error in filteredData computed:', error)
        return []
      }
    })

    // Sort filtered data
    const sortedData = computed(() => {
      try {
        if (!sortColumn.value || !filteredData.value || filteredData.value.length === 0) {
          return filteredData.value || []
        }

        return [...filteredData.value].sort((a, b) => {
          if (!a || !b) return 0

          const valA = String(a[sortColumn.value] || '').toLowerCase()
          const valB = String(b[sortColumn.value] || '').toLowerCase()

          if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1
          if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1
          return 0
        })
      } catch (error) {
        console.error('Error in sortedData computed:', error)
        return filteredData.value || []
      }
    })

    // Paginate sorted data
    const paginatedData = computed(() => {
      try {
        if (!sortedData.value || sortedData.value.length === 0) {
          return []
        }

        const start = (currentPage.value - 1) * rowsPerPage
        const end = start + rowsPerPage
        return sortedData.value.slice(start, end)
      } catch (error) {
        console.error('Error in paginatedData computed:', error)
        return []
      }
    })

    const totalPages = computed(() => {
      try {
        if (!filteredData.value || filteredData.value.length === 0) {
          return 1
        }
        return Math.ceil(filteredData.value.length / rowsPerPage)
      } catch (error) {
        console.error('Error in totalPages computed:', error)
        return 1
      }
    })

    // Watch for changes in filteredData to reset current page
    watch(filteredData, (newData) => {
      try {
        if (newData && newData.length > 0) {
          currentPage.value = 1
        }
      } catch (error) {
        console.error('Error in filteredData watch:', error)
      }
    })

    // Methods for sorting and pagination
    const toggleSort = (columnKey) => {
      try {
        const column = props.columns.find((c) => c.key === columnKey)
        if (!column?.sortable) return

        if (sortColumn.value === columnKey) {
          sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
        } else {
          sortColumn.value = columnKey
          sortDirection.value = 'asc'
        }
      } catch (error) {
        console.error('Error in toggleSort:', error)
      }
    }

    const nextPage = () => {
      try {
        if (currentPage.value < totalPages.value) {
          currentPage.value++
        }
      } catch (error) {
        console.error('Error in nextPage:', error)
      }
    }

    const prevPage = () => {
      try {
        if (currentPage.value > 1) {
          currentPage.value--
        }
      } catch (error) {
        console.error('Error in prevPage:', error)
      }
    }

    const handleRowClick = (item) => {
      try {
        emit('row-click', item)
      } catch (error) {
        console.error('Error in handleRowClick:', error)
      }
    }

    // Date and time formatting methods
    const formatDate = (date) => {
      if (!date) return ''
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(date))
    }

    const formatTime = (date) => {
      if (!date) return ''
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(new Date(date))
    }

    return {
      currentPage,
      sortColumn,
      sortDirection,
      globalSearchTerm,
      columnSearchTerms,
      paginatedData,
      totalPages,
      toggleSort,
      nextPage,
      prevPage,
      handleRowClick,
      formatDate,
      formatTime,
    }
  },
}
</script>

<style scoped>
@import '../assets/interactive-table.css';
</style>
