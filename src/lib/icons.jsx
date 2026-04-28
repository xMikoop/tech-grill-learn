import React from 'react';
import {
  Zap,
  Shield,
  Clock,
  Terminal,
  Database,
  Brain,
  Workflow,
  Rocket,
} from 'lucide-react';

export const renderIcon = (iconName, className) => {
  switch (iconName) {
    case 'Zap':
      return <Zap className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Database':
      return <Database className={className} />;
    case 'Brain':
      return <Brain className={className} />;
    case 'Workflow':
      return <Workflow className={className} />;
    case 'Rocket':
      return <Rocket className={className} />;
    default:
      return <Terminal className={className} />;
  }
};
