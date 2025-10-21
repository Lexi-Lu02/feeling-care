<template>
  <div class="interactive-table-container">
    <!-- Global Search Input -->
    <div class="table-controls">
      <label for="global-search" class="visually-hidden">Search all table columns</label>
      <input
        id="global-search"
        type="text"
        v-model="globalSearchTerm"
        placeholder="Search all columns..."
        class="form-control global-search-input"
        aria-label="Search all table columns"
        aria-describedby="search-help"
      />
      <div id="search-help" class="visually-hidden">
        Use this search to find content across all columns in the table
      </div>
    </div>

    <table
      v-if="data && columns && data.length > 0 && columns.length > 0"
      class="interactive-table"
      :key="`table-${data?.length || 0}-${columns?.length || 0}`"
      role="table"
      aria-label="Data table with sortable columns and search functionality"
    >
      <thead>
        <tr role="row">
          <th
            v-for="col in columns"
            :key="col.key"
            @click="toggleSort(col.key)"
            @keydown.enter="toggleSort(col.key)"
            @keydown.space.prevent="toggleSort(col.key)"
            :class="{ sortable: col.sortable }"
            role="columnheader"
            :tabindex="col.sortable ? 0 : -1"
            :aria-sort="getAriaSort(col.key)"
            :aria-label="getColumnHeaderLabel(col)"
          >
            {{ col.label }}
            <span v-if="sortColumn === col.key" aria-hidden="true">
              <i :class="['fas', sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down']"></i>
            </span>
            <span v-else-if="col.sortable" aria-hidden="true"><i class="fas fa-sort"></i></span>
          </th>
        </tr>
        <!-- Individual Column Search Row -->
        <tr class="column-search-row" role="row">
          <th v-for="col in columns" :key="col.key" role="columnheader">
            <label v-if="col.searchable" :for="`search-${col.key}`" class="visually-hidden">
              Search {{ col.label }}
            </label>
            <input
              v-if="col.searchable"
              :id="`search-${col.key}`"
              type="text"
              v-model="columnSearchTerms[col.key]"
              :placeholder="`Search ${col.label}`"
              class="form-control column-search-input"
              :aria-label="`Search ${col.label}`"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in paginatedData"
          :key="item?.id || `row-${index}`"
          @click="handleRowClick(item)"
          @keydown.enter="handleRowClick(item)"
          @keydown.space.prevent="handleRowClick(item)"
          class="table-row-clickable"
          role="row"
          :tabindex="0"
          :aria-label="getRowLabel(item, index)"
        >
          <td v-for="col in columns" :key="col.key" role="cell">
            <span v-if="col.type === 'date'">{{ formatDate(item?.[col.key]) }}</span>
            <span v-else-if="col.type === 'time'">{{ formatTime(item?.[col.key]) }}</span>
            <span v-else-if="col.type === 'actions'">
              <!-- Post actions -->
              <div v-if="item.title" class="action-buttons" role="group" aria-label="Post actions">
                <button
                  v-if="item.status !== 'published'"
                  @click.stop="$emit('publish-post', item)"
                  class="btn btn-sm btn-success me-1"
                  :aria-label="`Publish post: ${item.title}`"
                >
                  <i class="fas fa-check" aria-hidden="true"></i>
                </button>
                <button
                  @click.stop="$emit('delete-post', item)"
                  class="btn btn-sm btn-danger"
                  :aria-label="`Delete post: ${item.title}`"
                >
                  <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
              </div>
              <!-- User actions -->
              <div v-if="item.email" class="action-buttons" role="group" aria-label="User actions">
                <button
                  @click.stop="$emit('edit-user-role', item)"
                  class="btn btn-sm btn-primary me-1"
                  :aria-label="`Edit user: ${item.email || item.displayName}`"
                >
                  <i class="fas fa-edit" aria-hidden="true"></i>
                </button>
                <button
                  @click.stop="$emit('delete-user', item)"
                  class="btn btn-sm btn-danger"
                  :aria-label="`Delete user: ${item.email || item.displayName}`"
                >
                  <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            </span>
            <span v-else>{{ item?.[col.key] || '' }}</span>
          </td>
        </tr>
        <tr v-if="paginatedData.length === 0" role="row">
          <td :colspan="columns.length" class="no-data" role="cell">
            <span role="status" aria-live="polite">No data found.</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Fallback when table can't render -->
    <div v-else class="table-fallback">
      <p>Loading table data...</p>
    </div>

    <!-- Pagination Controls -->
    <nav class="pagination-controls" role="navigation" aria-label="Table pagination">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="btn btn-outline-primary"
        :aria-label="`Go to previous page, page ${currentPage - 1}`"
      >
        <i class="fas fa-chevron-left me-1" aria-hidden="true"></i>Previous
      </button>
      <span class="pagination-info" aria-live="polite" aria-atomic="true">
        Page {{ currentPage }} of {{ totalPages }} ({{ filteredData?.length || 0 }} total items)
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="btn btn-outline-primary"
        :aria-label="`Go to next page, page ${currentPage + 1}`"
      >
        Next<i class="fas fa-chevron-right ms-1" aria-hidden="true"></i>
      </button>
    </nav>
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
  emits: ['row-click', 'delete-post', 'edit-user-role', 'delete-user', 'publish-post'],
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
      try {
        const dateObj = new Date(date)
        if (isNaN(dateObj.getTime())) return 'Invalid Date'
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(dateObj)
      } catch (error) {
        console.error('Error formatting date:', error)
        return 'Invalid Date'
      }
    }

    const formatTime = (date) => {
      if (!date) return ''
      try {
        const dateObj = new Date(date)
        if (isNaN(dateObj.getTime())) return 'Invalid Time'
        return new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(dateObj)
      } catch (error) {
        console.error('Error formatting time:', error)
        return 'Invalid Time'
      }
    }

    // Accessibility helper methods
    const getAriaSort = (columnKey) => {
      if (sortColumn.value !== columnKey) return 'none'
      return sortDirection.value === 'asc' ? 'ascending' : 'descending'
    }

    const getColumnHeaderLabel = (col) => {
      let label = col.label
      if (col.sortable) {
        label += '. Click to sort'
        if (sortColumn.value === col.key) {
          label += `. Currently sorted ${sortDirection.value === 'asc' ? 'ascending' : 'descending'}`
        }
      }
      return label
    }

    const getRowLabel = (item, index) => {
      const labels = []
      // Get key identifying information from the item
      if (item.title) labels.push(`Post: ${item.title}`)
      if (item.email) labels.push(`User: ${item.email}`)
      if (item.displayName && !item.email) labels.push(`User: ${item.displayName}`)

      if (labels.length === 0) {
        labels.push(`Row ${index + 1}`)
      }

      labels.push(`Click to view details`)
      return labels.join('. ')
    }

    return {
      currentPage,
      sortColumn,
      sortDirection,
      globalSearchTerm,
      columnSearchTerms,
      filteredData,
      paginatedData,
      totalPages,
      toggleSort,
      nextPage,
      prevPage,
      handleRowClick,
      formatDate,
      formatTime,
      getAriaSort,
      getColumnHeaderLabel,
      getRowLabel,
    }
  },
}
</script>

<style scoped>
@import '../assets/interactive-table.css';
</style>
