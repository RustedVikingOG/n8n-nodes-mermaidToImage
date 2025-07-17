# Template Generator

## 📋 TEMPLATE CREATION PROTOCOL

NOTE: Always follow the existing template patterns in [.docs/ai/templates/*.md] when creating new templates.

## 🔄 MANDATORY SYNC PROTOCOL

1. **Understand Request**: Analyze what type of template the user wants to create.

2. **Read Base Templates**: Review existing templates in [.docs/ai/templates/] to understand the structure and patterns.

3. **Identify Template Type**: Determine if the request matches one of the available template types or requires a custom template.

4. **Create Template**: Generate the template following the established patterns with:
   - Proper markdown structure
   - Placeholder sections marked with [PLACEHOLDER] format
   - Mermaid diagram templates where applicable
   - Clear section headers and organization
   - Instructional comments using // syntax

5. **Validate Structure**: Ensure the template follows the same structural patterns as existing relevant templates.

🔄 CONTINUE UNTIL THE TEMPLATE IS COMPLETE AND FOLLOWS ALL ESTABLISHED PATTERNS.

## 📝 TEMPLATE TYPES & USAGE

### Template Type: architecture
**Purpose**: Create system architecture documentation
**Base Template**: [.docs/ai/templates/__architecture.md]
**Use When**: User needs to document system components, their interactions, and technical architecture

### Template Type: contribute  
**Purpose**: Create collaboration and contribution guides
**Base Template**: [.docs/ai/templates/__CONTRIBUTE.md]
**Use When**: User needs to document project structure, technologies, and collaboration guidelines

### Template Type: plan
**Purpose**: Create comprehensive solution plans
**Base Template**: [.docs/ai/templates/__plan.md] 
**Use When**: User needs to plan implementation with use cases, features, and validation strategies

### Template Type: use_cases
**Purpose**: Create use case documentation  
**Base Template**: [.docs/ai/templates/__use_cases.md]
**Use When**: User needs to document specific use cases with features, state diagrams, and data relationships

### Template Type: custom
**Purpose**: Create custom templates based on user specifications
**Base Template**: Follow patterns from existing relevant templates in [.docs/ai/templates/]
**Use When**: User needs a template that doesn't match the existing types

## ‼️ Rules

- ✅ Use [PLACEHOLDER] format for sections that need to be filled in
- ✅ Include clear section headers and organization
- ✅ Add instructional comments using // syntax where helpful
- ✅ Include mermaid diagram templates with proper syntax
- ✅ Follow the markdown structure patterns from existing templates
- ✅ Ensure templates are specific and actionable
- ❌ Don't create generic templates without clear structure
- ❌ Don't omit placeholder sections that users need to fill
- ❌ Don't create templates that don't follow established patterns

## 🎯 TEMPLATE GENERATION WORKFLOW

1. **Analyze Request**: Determine template type and specific requirements
2. **Review Base**: Read the corresponding base template for structure
3. **Generate Template**: Create new template with proper placeholders
4. **Validate**: Ensure it follows established patterns and includes all necessary sections
5. **Deliver**: Present the template with usage instructions
