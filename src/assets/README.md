# CSS File Organization

This directory contains the organized CSS files for the Feeling Care application.

## File Structure

### `custom.css` (Main Entry Point)

- **Purpose**: Main CSS file that imports all other CSS files
- **Content**: Only import statements
- **Size**: ~6 lines

### `variables.css`

- **Purpose**: CSS variables and root styles
- **Content**:
  - Color palette variables
  - Body background styles
  - Global font settings
- **Size**: ~20 lines

### `navbar.css`

- **Purpose**: Navigation bar specific styles
- **Content**:
  - Navbar layout and positioning
  - Logo placeholder styles
  - Navigation links and hover effects
  - Search functionality
  - User menu styles
- **Size**: ~150 lines

### `components.css`

- **Purpose**: Reusable component styles
- **Content**:
  - Button styles
  - Card components
  - Form styles
  - Link styles
  - Authentication form styles
- **Size**: ~80 lines

### `pages.css`

- **Purpose**: Page-specific styles
- **Content**:
  - Homepage styles (hero, data, cards sections)
  - GetSupport page styles
  - Information & Resources page styles
  - Admin Dashboard styles
- **Size**: ~600 lines

### `responsive.css`

- **Purpose**: Responsive design and media queries
- **Content**:
  - Mobile-first responsive breakpoints
  - Device-specific adjustments
  - Responsive navigation
- **Size**: ~200 lines

## Benefits of This Organization

### ✅ **Maintainability**

- Easy to find and modify specific styles
- Clear separation of concerns
- Reduced merge conflicts

### ✅ **Performance**

- Smaller individual files
- Better caching strategies
- Faster development builds

### ✅ **Scalability**

- Easy to add new page-specific styles
- Modular component development
- Team collaboration friendly

### ✅ **Debugging**

- Easier to locate style issues
- Clear file responsibilities
- Better error tracking

## Usage

The main `custom.css` file automatically imports all other files using CSS `@import` statements. No changes needed to the build process.

## Adding New Styles

1. **Global variables**: Add to `variables.css`
2. **Navigation**: Add to `navbar.css`
3. **Reusable components**: Add to `components.css`
4. **Page-specific**: Add to `pages.css`
5. **Responsive**: Add to `responsive.css`

## File Sizes (Approximate)

- **Before**: 1,014 lines in single file
- **After**: 5 organized files totaling ~1,050 lines
- **Improvement**: Better organization, easier maintenance
