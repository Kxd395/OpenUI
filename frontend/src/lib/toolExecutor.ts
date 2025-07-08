import { ToolDefinition } from '../stores/tools'

export interface ToolCall {
  id: string
  name: string
  arguments: Record<string, any>
  result?: any
  error?: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  timestamp: number
  executionTime?: number
}

export interface ToolResult {
  success: boolean
  data?: any
  error?: string
  metadata?: {
    contentType?: string
    displayType?: 'text' | 'html' | 'image' | 'json' | 'iframe'
    executionTime?: number
  }
}

export class ToolExecutor {
  private clientTools: Map<string, Function> = new Map()
  
  constructor() {
    this.initializeDefaultTools()
  }

  private initializeDefaultTools() {
    // JavaScript execution tool
    this.clientTools.set('javascript', async (args: { code: string }) => {
      try {
        const result = await this.executeJavaScript(args.code)
        return {
          success: true,
          data: result,
          metadata: {
            contentType: 'application/json',
            displayType: 'json' as const
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          metadata: {
            contentType: 'text/plain',
            displayType: 'text' as const
          }
        }
      }
    })

    // HTML renderer tool
    this.clientTools.set('html_renderer', async (args: { html: string, css?: string }) => {
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 20px; }
            ${args.css || ''}
          </style>
        </head>
        <body>
          ${args.html}
        </body>
        </html>
      `
      return {
        success: true,
        data: fullHtml,
        metadata: {
          contentType: 'text/html',
          displayType: 'html' as const
        }
      }
    })

    // Interactive component creator
    this.clientTools.set('create_interactive_component', async (args: { 
      componentType: string, 
      features: string, 
      styling?: string 
    }) => {
      const component = await this.createInteractiveComponent(args)
      return {
        success: true,
        data: component,
        metadata: {
          contentType: 'text/html',
          displayType: 'html' as const
        }
      }
    })

    // Sample data generator
    this.clientTools.set('generate_sample_data', async (args: { 
      dataType: string, 
      count: string, 
      fields?: string 
    }) => {
      const data = await this.generateSampleData(args)
      return {
        success: true,
        data: data,
        metadata: {
          contentType: 'application/json',
          displayType: 'json' as const
        }
      }
    })

    // Chart generator
    this.clientTools.set('create_chart', async (args: { 
      type: string, 
      data: any, 
      options?: any 
    }) => {
      const chart = await this.createChart(args)
      return {
        success: true,
        data: chart,
        metadata: {
          contentType: 'text/html',
          displayType: 'html' as const
        }
      }
    })
  }

  async executeTool(toolCall: ToolCall): Promise<ToolResult> {
    const startTime = Date.now()
    
    try {
      // Check if it's a client-side tool
      if (this.clientTools.has(toolCall.name)) {
        const tool = this.clientTools.get(toolCall.name)!
        const result = await tool(toolCall.arguments)
        result.metadata = {
          ...result.metadata,
          executionTime: Date.now() - startTime
        }
        return result
      }

      // For server-side tools, we'd make API calls here
      // For now, return a placeholder
      return {
        success: false,
        error: `Tool '${toolCall.name}' not found`,
        metadata: {
          contentType: 'text/plain',
          displayType: 'text',
          executionTime: Date.now() - startTime
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          contentType: 'text/plain',
          displayType: 'text',
          executionTime: Date.now() - startTime
        }
      }
    }
  }

  private async executeJavaScript(code: string): Promise<any> {
    // Create a safe execution environment
    const consoleOutput: string[] = []
    const originalConsole = console.log
    
    // Override console.log to capture output
    console.log = (...args: any[]) => {
      consoleOutput.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '))
      originalConsole.apply(console, args)
    }

    try {
      // Execute code in a function scope
      const func = new Function('console', `
        ${code}
      `)
      
      const result = func(console)
      
      return {
        result: result,
        consoleOutput: consoleOutput,
        success: true
      }
    } catch (error) {
      throw new Error(`JavaScript execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      // Restore original console.log
      console.log = originalConsole
    }
  }

  private async createInteractiveComponent(args: { 
    componentType: string, 
    features: string, 
    styling?: string 
  }): Promise<string> {
    const { componentType, features, styling = 'modern' } = args
    const featureList = features.split(',').map(f => f.trim())
    
    // Generate component based on type
    switch (componentType.toLowerCase()) {
      case 'form':
        return this.generateFormComponent(featureList, styling)
      case 'table':
        return this.generateTableComponent(featureList, styling)
      case 'modal':
        return this.generateModalComponent(featureList, styling)
      case 'chart':
        return this.generateChartComponent(featureList, styling)
      default:
        return this.generateGenericComponent(componentType, featureList, styling)
    }
  }

  private generateFormComponent(features: string[], styling: string): string {
    const hasValidation = features.includes('validation')
    const hasSubmission = features.includes('submission')
    const hasReset = features.includes('reset')
    
    return `
    <div class="form-container ${styling}">
      <form id="dynamicForm" class="space-y-6">
        <div class="form-group">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" name="name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        </div>
        
        <div class="form-group">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" name="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        </div>
        
        <div class="form-group">
          <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="message" name="message" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
        </div>
        
        <div class="form-actions space-x-3">
          <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Submit
          </button>
          ${hasReset ? '<button type="reset" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Reset</button>' : ''}
        </div>
      </form>
      
      <div id="formMessage" class="mt-4 hidden"></div>
    </div>
    
    <style>
      .form-container.modern {
        max-width: 500px;
        margin: 0 auto;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }
      
      .form-container input, .form-container textarea {
        transition: all 0.3s ease;
      }
      
      .form-container input:focus, .form-container textarea:focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
      }
      
      .form-container button {
        transition: all 0.3s ease;
      }
      
      .form-container button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      .form-message {
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
      }
      
      .form-message.success {
        background-color: #d1fae5;
        color: #065f46;
        border: 1px solid #10b981;
      }
      
      .form-message.error {
        background-color: #fee2e2;
        color: #991b1b;
        border: 1px solid #ef4444;
      }
    </style>
    
    <script>
      document.getElementById('dynamicForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {};
        for (let [key, value] of formData.entries()) {
          data[key] = value;
        }
        
        ${hasValidation ? `
        // Validation
        if (!data.name || data.name.length < 2) {
          showMessage('Name must be at least 2 characters long', 'error');
          return;
        }
        
        if (!data.email || !data.email.includes('@')) {
          showMessage('Please enter a valid email address', 'error');
          return;
        }
        ` : ''}
        
        ${hasSubmission ? `
        // Simulate submission
        showMessage('Form submitted successfully!', 'success');
        console.log('Form data:', data);
        ` : `
        showMessage('Form validation passed!', 'success');
        console.log('Form data:', data);
        `}
      });
      
      function showMessage(message, type) {
        const messageDiv = document.getElementById('formMessage');
        messageDiv.textContent = message;
        messageDiv.className = 'form-message ' + type;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
          messageDiv.style.display = 'none';
        }, 5000);
      }
    </script>
    `
  }

  private generateTableComponent(features: string[], styling: string): string {
    const hasSearch = features.includes('search')
    const hasSorting = features.includes('sorting')
    const hasPagination = features.includes('pagination')
    
    return `
    <div class="table-container ${styling}">
      ${hasSearch ? `
      <div class="search-container mb-4">
        <input type="text" id="searchInput" placeholder="Search..." class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      ` : ''}
      
      <div class="table-wrapper">
        <table id="dataTable" class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${hasSorting ? 'cursor-pointer hover:bg-gray-100' : ''}" data-column="name">
                Name ${hasSorting ? '↕️' : ''}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${hasSorting ? 'cursor-pointer hover:bg-gray-100' : ''}" data-column="email">
                Email ${hasSorting ? '↕️' : ''}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${hasSorting ? 'cursor-pointer hover:bg-gray-100' : ''}" data-column="role">
                Role ${hasSorting ? '↕️' : ''}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody id="tableBody" class="bg-white divide-y divide-gray-200">
            <!-- Data will be populated by JavaScript -->
          </tbody>
        </table>
      </div>
      
      ${hasPagination ? `
      <div class="pagination-container mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          Showing <span id="showing">1-10</span> of <span id="total">0</span> entries
        </div>
        <div class="flex space-x-2">
          <button id="prevBtn" class="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
          <button id="nextBtn" class="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
      ` : ''}
    </div>
    
    <style>
      .table-container.modern {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
      }
      
      .table-wrapper {
        overflow-x: auto;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
      }
      
      #dataTable {
        min-width: 600px;
      }
      
      #dataTable tbody tr:hover {
        background-color: #f9fafb;
      }
      
      .search-container input {
        transition: all 0.3s ease;
      }
      
      .search-container input:focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      }
      
      .action-btn {
        padding: 0.25rem 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.3s ease;
        cursor: pointer;
      }
      
      .action-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      
      .action-btn.edit {
        background-color: #3b82f6;
        color: white;
      }
      
      .action-btn.delete {
        background-color: #ef4444;
        color: white;
      }
    </style>
    
    <script>
      // Sample data
      const sampleData = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin' }
      ];
      
      let currentData = [...sampleData];
      let currentPage = 1;
      const itemsPerPage = 10;
      let sortColumn = null;
      let sortDirection = 'asc';
      
      function renderTable() {
        const tbody = document.getElementById('tableBody');
        ${hasPagination ? `
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = currentData.slice(start, end);
        ` : 'const pageData = currentData;'}
        
        tbody.innerHTML = pageData.map(item => \`
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">\${item.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">\${item.email}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">\${item.role}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
              <button class="action-btn edit" onclick="editItem(\${item.id})">Edit</button>
              <button class="action-btn delete" onclick="deleteItem(\${item.id})">Delete</button>
            </td>
          </tr>
        \`).join('');
        
        ${hasPagination ? `
        document.getElementById('total').textContent = currentData.length;
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, currentData.length);
        document.getElementById('showing').textContent = \`\${start}-\${end}\`;
        
        document.getElementById('prevBtn').disabled = currentPage === 1;
        document.getElementById('nextBtn').disabled = end >= currentData.length;
        ` : ''}
      }
      
      ${hasSearch ? `
      document.getElementById('searchInput').addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        currentData = sampleData.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query)
        );
        currentPage = 1;
        renderTable();
      });
      ` : ''}
      
      ${hasSorting ? `
      document.querySelectorAll('[data-column]').forEach(th => {
        th.addEventListener('click', function() {
          const column = this.dataset.column;
          if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
            sortColumn = column;
            sortDirection = 'asc';
          }
          
          currentData.sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return sortDirection === 'asc' ? comparison : -comparison;
          });
          
          renderTable();
        });
      });
      ` : ''}
      
      ${hasPagination ? `
      document.getElementById('prevBtn').addEventListener('click', function() {
        if (currentPage > 1) {
          currentPage--;
          renderTable();
        }
      });
      
      document.getElementById('nextBtn').addEventListener('click', function() {
        const totalPages = Math.ceil(currentData.length / itemsPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          renderTable();
        }
      });
      ` : ''}
      
      function editItem(id) {
        const item = currentData.find(item => item.id === id);
        alert(\`Edit item: \${JSON.stringify(item, null, 2)}\`);
      }
      
      function deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
          currentData = currentData.filter(item => item.id !== id);
          renderTable();
        }
      }
      
      // Initialize table
      renderTable();
    </script>
    `
  }

  private generateModalComponent(features: string[], styling: string): string {
    const hasBackdrop = features.includes('backdrop')
    const hasAnimation = features.includes('animation')
    
    return `
    <div class="modal-demo ${styling}">
      <button id="openModal" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Open Modal
      </button>
      
      <div id="modal" class="modal-overlay ${hasAnimation ? 'animated' : ''}" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="text-xl font-bold">Modal Title</h2>
            <button id="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          
          <div class="modal-body">
            <p>This is a modal dialog. You can put any content here.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          
          <div class="modal-footer">
            <button id="cancelBtn" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            <button id="confirmBtn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Confirm</button>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      
      .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .modal-body {
        padding: 1.5rem;
      }
      
      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid #e5e7eb;
      }
      
      ${hasAnimation ? `
      .modal-overlay.animated {
        animation: fadeIn 0.3s ease;
      }
      
      .modal-overlay.animated .modal-content {
        animation: slideIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      ` : ''}
    </style>
    
    <script>
      const modal = document.getElementById('modal');
      const openBtn = document.getElementById('openModal');
      const closeBtn = document.getElementById('closeModal');
      const cancelBtn = document.getElementById('cancelBtn');
      const confirmBtn = document.getElementById('confirmBtn');
      
      openBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
      });
      
      function closeModal() {
        modal.style.display = 'none';
      }
      
      closeBtn.addEventListener('click', closeModal);
      cancelBtn.addEventListener('click', closeModal);
      
      confirmBtn.addEventListener('click', function() {
        alert('Confirmed!');
        closeModal();
      });
      
      ${hasBackdrop ? `
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
      ` : ''}
      
      // Close with Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
          closeModal();
        }
      });
    </script>
    `
  }

  private generateChartComponent(features: string[], styling: string): string {
    return `
    <div class="chart-container ${styling}">
      <canvas id="myChart" width="400" height="200"></canvas>
    </div>
    
    <style>
      .chart-container.modern {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 0 auto;
      }
      
      #myChart {
        max-width: 100%;
        height: auto;
      }
    </style>
    
    <script>
      // Simple chart implementation without external libraries
      const canvas = document.getElementById('myChart');
      const ctx = canvas.getContext('2d');
      
      const data = [
        { label: 'January', value: 65 },
        { label: 'February', value: 59 },
        { label: 'March', value: 80 },
        { label: 'April', value: 81 },
        { label: 'May', value: 56 },
        { label: 'June', value: 55 }
      ];
      
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
      
      function drawChart() {
        const width = canvas.width;
        const height = canvas.height;
        const padding = 60;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, width, height);
        
        // Find max value
        const maxValue = Math.max(...data.map(d => d.value));
        
        // Draw bars
        const barWidth = chartWidth / data.length;
        
        data.forEach((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding + index * barWidth + barWidth * 0.1;
          const y = height - padding - barHeight;
          const width = barWidth * 0.8;
          
          // Draw bar
          ctx.fillStyle = colors[index % colors.length];
          ctx.fillRect(x, y, width, barHeight);
          
          // Draw value on top
          ctx.fillStyle = '#374151';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(item.value, x + width / 2, y - 5);
          
          // Draw label
          ctx.fillText(item.label, x + width / 2, height - padding + 20);
        });
        
        // Draw title
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Sample Chart', width / 2, 30);
      }
      
      drawChart();
    </script>
    `
  }

  private generateGenericComponent(type: string, features: string[], styling: string): string {
    return `
    <div class="generic-component ${styling}">
      <h2 class="text-2xl font-bold mb-4">${type} Component</h2>
      <p class="text-gray-600 mb-4">This is a generic ${type} component with the following features:</p>
      <ul class="list-disc list-inside space-y-2">
        ${features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
      
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-700">
          This component would typically include functionality for: ${features.join(', ')}
        </p>
      </div>
    </div>
    
    <style>
      .generic-component.modern {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        max-width: 600px;
        margin: 0 auto;
      }
    </style>
    `
  }

  private async generateSampleData(args: { 
    dataType: string, 
    count: string, 
    fields?: string 
  }): Promise<any[]> {
    const { dataType, count, fields } = args
    const numItems = parseInt(count) || 10
    const fieldList = fields ? fields.split(',').map(f => f.trim()) : null
    
    const generators: Record<string, () => any[]> = {
      users: () => this.generateUserData(numItems, fieldList),
      products: () => this.generateProductData(numItems, fieldList),
      posts: () => this.generatePostData(numItems, fieldList),
      analytics: () => this.generateAnalyticsData(numItems, fieldList),
      companies: () => this.generateCompanyData(numItems, fieldList),
      events: () => this.generateEventData(numItems, fieldList)
    }
    
    const generator = generators[dataType.toLowerCase()] || generators.users
    return generator()
  }

  private generateUserData(count: number, fields?: string[] | null): any[] {
    const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry']
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Wilson', 'Davis', 'Miller', 'Garcia', 'Rodriguez', 'Martinez', 'Anderson']
    const roles = ['Admin', 'User', 'Editor', 'Moderator', 'Viewer']
    
    return Array.from({ length: count }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const user = {
        id: i + 1,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        age: Math.floor(Math.random() * 50) + 18,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: Math.random() > 0.3
      }
      
      if (fields) {
        const filtered: Record<string, any> = {}
        fields.forEach(field => {
          if ((user as any)[field] !== undefined) {
            filtered[field] = (user as any)[field]
          }
        })
        return filtered
      }
      
      return user
    })
  }

  private generateProductData(count: number, fields?: string[] | null): any[] {
    const products = ['Laptop', 'Phone', 'Tablet', 'Headphones', 'Camera', 'Watch', 'Keyboard', 'Mouse', 'Monitor', 'Speaker']
    const brands = ['Apple', 'Samsung', 'Sony', 'Microsoft', 'Google', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer']
    const categories = ['Electronics', 'Computers', 'Audio', 'Mobile', 'Gaming', 'Accessories']
    
    return Array.from({ length: count }, (_, i) => {
      const product = {
        id: i + 1,
        name: `${brands[Math.floor(Math.random() * brands.length)]} ${products[Math.floor(Math.random() * products.length)]}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 2000) + 50,
        stock: Math.floor(Math.random() * 100),
        rating: Math.floor(Math.random() * 50) / 10,
        inStock: Math.random() > 0.2,
        description: `High-quality ${products[Math.floor(Math.random() * products.length)].toLowerCase()} with excellent features.`
      }
      
      if (fields) {
        const filtered: Record<string, any> = {}
        fields.forEach(field => {
          if ((product as any)[field] !== undefined) {
            filtered[field] = (product as any)[field]
          }
        })
        return filtered
      }
      
      return product
    })
  }

  private generatePostData(count: number, fields?: string[] | null): any[] {
    const titles = [
      'Getting Started with React',
      'Advanced TypeScript Tips',
      'Building Modern UIs',
      'Performance Optimization',
      'State Management Patterns',
      'API Integration Best Practices',
      'Testing Strategies',
      'Deployment and DevOps',
      'Security Considerations',
      'Future of Web Development'
    ]
    
    return Array.from({ length: count }, (_, i) => {
      const post = {
        id: i + 1,
        title: titles[Math.floor(Math.random() * titles.length)],
        author: `Author ${i + 1}`,
        content: `This is a sample post content for post ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        publishDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
        tags: ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML'].slice(0, Math.floor(Math.random() * 3) + 1),
        published: Math.random() > 0.1
      }
      
      if (fields) {
        const filtered: Record<string, any> = {}
        fields.forEach(field => {
          if ((post as any)[field] !== undefined) {
            filtered[field] = (post as any)[field]
          }
        })
        return filtered
      }
      
      return post
    })
  }

  private generateAnalyticsData(count: number, fields?: string[] | null): any[] {
    const metrics = ['pageviews', 'sessions', 'users', 'bounceRate', 'avgSessionDuration']
    
    return Array.from({ length: count }, (_, i) => {
      const analytics = {
        id: i + 1,
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        pageviews: Math.floor(Math.random() * 10000) + 1000,
        sessions: Math.floor(Math.random() * 5000) + 500,
        users: Math.floor(Math.random() * 3000) + 300,
        bounceRate: Math.floor(Math.random() * 80) + 20,
        avgSessionDuration: Math.floor(Math.random() * 300) + 60,
        source: ['organic', 'direct', 'social', 'referral', 'email'][Math.floor(Math.random() * 5)],
        device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)]
      }
      
      if (fields) {
        const filtered: Record<string, any> = {}
        fields.forEach(field => {
          if ((analytics as any)[field] !== undefined) {
            filtered[field] = (analytics as any)[field]
          }
        })
        return filtered
      }
      
      return analytics
    })
  }

  private generateCompanyData(count: number, fields?: string[] | null): any[] {
    const companies = ['TechCorp', 'InnovateCo', 'FutureWorks', 'DataSystems', 'CloudFirst', 'MobileNext', 'AIAdvanced', 'WebSolutions', 'DevTools', 'CodeCraft']
    const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Media', 'Transportation']
    
    return Array.from({ length: count }, (_, i) => {
      const company = {
        id: i + 1,
        name: companies[Math.floor(Math.random() * companies.length)],
        industry: industries[Math.floor(Math.random() * industries.length)],
        employees: Math.floor(Math.random() * 10000) + 10,
        revenue: Math.floor(Math.random() * 1000000000) + 1000000,
        founded: Math.floor(Math.random() * 50) + 1974,
        headquarters: ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Toronto'][Math.floor(Math.random() * 6)],
        isPublic: Math.random() > 0.5,
        website: `https://www.${companies[Math.floor(Math.random() * companies.length)].toLowerCase()}.com`
      }
      
      if (fields) {
        const filtered: Record<string, any> = {}
        fields.forEach(field => {
          if ((company as any)[field] !== undefined) {
            filtered[field] = (company as any)[field]
          }
        })
        return filtered
      }
      
      return company
    })
  }

  private generateEventData(count: number, fields?: string[] | null): any[] {
    const events = ['Conference', 'Workshop', 'Webinar', 'Meetup', 'Hackathon', 'Training', 'Seminar', 'Presentation']
    const topics = ['JavaScript', 'Python', 'Design', 'Marketing', 'AI/ML', 'DevOps', 'Security', 'Mobile']
    
    return Array.from({ length: count }, (_, i) => {
      const event = {
        id: i + 1,
        name: `${topics[Math.floor(Math.random() * topics.length)]} ${events[Math.floor(Math.random() * events.length)]}`,
        date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: ['Online', 'New York', 'San Francisco', 'London', 'Berlin', 'Toronto'][Math.floor(Math.random() * 6)],
        attendees: Math.floor(Math.random() * 1000) + 10,
        maxCapacity: Math.floor(Math.random() * 500) + 50,
        price: Math.floor(Math.random() * 500),
        organizer: `${events[Math.floor(Math.random() * events.length)]} Org`,
        description: `Learn about ${topics[Math.floor(Math.random() * topics.length)]} in this comprehensive ${events[Math.floor(Math.random() * events.length)].toLowerCase()}.`,
        isVirtual: Math.random() > 0.4
      }
      
      if (fields) {
        const filtered: Record<string, any> = {}
        fields.forEach(field => {
          if ((event as any)[field] !== undefined) {
            filtered[field] = (event as any)[field]
          }
        })
        return filtered
      }
      
      return event
    })
  }

  private async createChart(args: { type: string, data: any, options?: any }): Promise<string> {
    const { type, data, options = {} } = args
    
    // For now, return a simple chart HTML
    return `
    <div class="chart-container">
      <h3 class="text-lg font-semibold mb-4">${options.title || 'Chart'}</h3>
      <div class="chart-placeholder">
        <p>Chart Type: ${type}</p>
        <p>Data Points: ${Array.isArray(data) ? data.length : 'N/A'}</p>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">
${JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
    
    <style>
      .chart-container {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .chart-placeholder {
        border: 2px dashed #d1d5db;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        color: #6b7280;
      }
    </style>
    `
  }

  // Register a new client-side tool
  registerTool(name: string, handler: (args: any) => Promise<ToolResult>) {
    this.clientTools.set(name, handler)
  }

  // Get list of available tools
  getAvailableTools(): string[] {
    return Array.from(this.clientTools.keys())
  }
}

export const toolExecutor = new ToolExecutor()
