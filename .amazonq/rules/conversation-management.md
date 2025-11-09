# Amazon Q Conversation Management Rules

## 🧠 Context Preservation Strategy

### Automatic Context Loading
- **Architecture**: Always reference mission-mischief-architecture.md for system knowledge
- **Troubleshooting**: Follow troubleshooting-framework.md for systematic problem-solving
- **User Preferences**: Prioritize real data over mock, minimal code, mobile-first design

### Conversation Compaction Protocol
When chat approaches token limits:
1. **Generate Summary**: Create detailed session summary with key findings
2. **Export History**: Save full conversation as markdown file
3. **Use /compact**: Let Q compress with high-quality summary as context
4. **Pin Summary**: In new session, pin exported file for reference

### Session Continuity
- **Project State**: Always check troubleshooting/ directory for active issues
- **Recent Changes**: Reference 03_final_state/ folders for latest working code
- **Migration Status**: Currently at Step 3 of PREMIUM_MIGRATION_GUIDE.md
- **Cost Monitoring**: System target is $50-70/month, monitor via admin.html

### Communication Style
- **Direct Response**: Skip flattery, respond directly to user needs
- **Minimal Code**: Write only essential code, avoid verbose implementations
- **Technical Focus**: User is experienced developer, use appropriate technical language
- **Real Solutions**: User strongly dislikes mock data suggestions, always aim for production fixes

### Problem-Solving Approach
1. **Read Current State**: Check relevant files before suggesting changes
2. **Structured Analysis**: Use troubleshooting framework for complex issues
3. **Document Changes**: Create session logs for significant modifications
4. **Validate Solutions**: Test fixes thoroughly before marking complete
5. **Update Knowledge**: Modify .amazonq/rules/ files when new patterns emerge

### Emergency Protocols
- **System Down**: Check admin.html dashboard, CloudWatch logs, manual Lambda invoke
- **High Costs**: Review admin cost monitoring, check Bright Data usage
- **Data Issues**: Verify DynamoDB table, test API endpoints, check CORS configuration
- **Frontend Bugs**: Browser console, mobile viewport testing, API connectivity

This framework ensures Amazon Q maintains deep project context and provides consistent, effective assistance across all Mission Mischief development activities.