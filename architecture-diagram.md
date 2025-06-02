```mermaid
graph TB
    %% Main Application Structure
    subgraph "BuddyFi Application"
        %% Core Application Structure
        App[App Root]
        Layout[Layout Component]
        
        %% Main Routes/Pages
        subgraph "Pages"
            Home[Home Page]
            Auth[Authentication]
            Dashboard[Dashboard]
            Discover[Discover]
            Matches[Matches]
            Profile[Profile]
            Payment[Payment]
            Workspace[Workspace]
            Admin[Admin Buddy]
        end
        
        %% Components
        subgraph "Components"
            Nav[Navbar]
            Footer[Footer]
            UserCard[User Card]
            ProfileForm[Profile Form]
            ProfileDisplay[Profile Display]
            MessageChat[Message Chat]
            SubscriptionCard[Subscription Card]
            DevIcon[Dev Icon]
            RoadmapTimeline[Roadmap Timeline]
            FeatureCard[Feature Card]
            TestimonialCarousel[Testimonial Carousel]
        end
        
        %% Services & Utils
        subgraph "Services & Utils"
            API[API Services]
            Context[Context Providers]
            Hooks[Custom Hooks]
            Utils[Utility Functions]
        end
        
        %% Data Flow
        subgraph "Data Flow"
            Types[Type Definitions]
            Contracts[Smart Contracts]
            Lib[Library Functions]
        end
    end
    
    %% Relationships
    App --> Layout
    Layout --> Nav
    Layout --> Footer
    
    %% Page Connections
    App --> Home
    App --> Auth
    App --> Dashboard
    App --> Discover
    App --> Matches
    App --> Profile
    App --> Payment
    App --> Workspace
    App --> Admin
    
    %% Component Usage
    Dashboard --> UserCard
    Profile --> ProfileForm
    Profile --> ProfileDisplay
    Matches --> MessageChat
    Payment --> SubscriptionCard
    Home --> DevIcon
    Home --> RoadmapTimeline
    Home --> FeatureCard
    Home --> TestimonialCarousel
    
    %% Service Connections
    API --> Types
    Context --> Types
    Hooks --> Utils
    Contracts --> Lib
    
    %% Styling
    classDef page fill:#f9f,stroke:#333,stroke-width:2px
    classDef component fill:#bbf,stroke:#333,stroke-width:2px
    classDef service fill:#bfb,stroke:#333,stroke-width:2px
    classDef data fill:#fbb,stroke:#333,stroke-width:2px
    
    class Home,Auth,Dashboard,Discover,Matches,Profile,Payment,Workspace,Admin page
    class Nav,Footer,UserCard,ProfileForm,ProfileDisplay,MessageChat,SubscriptionCard,DevIcon,RoadmapTimeline,FeatureCard,TestimonialCarousel component
    class API,Context,Hooks,Utils service
    class Types,Contracts,Lib data
```

# BuddyFi Architecture Diagram

This diagram represents the architecture of the BuddyFi application, showing the main components, their relationships, and data flow. The diagram is created using Mermaid.js syntax and can be imported into Figma or other diagramming tools.

## Key Components:

1. **Pages**
   - Home
   - Authentication
   - Dashboard
   - Discover
   - Matches
   - Profile
   - Payment
   - Workspace
   - Admin Buddy

2. **Core Components**
   - Navbar
   - Footer
   - User Card
   - Profile Form/Display
   - Message Chat
   - Subscription Card
   - Dev Icon
   - Roadmap Timeline
   - Feature Card
   - Testimonial Carousel

3. **Services & Utils**
   - API Services
   - Context Providers
   - Custom Hooks
   - Utility Functions

4. **Data Flow**
   - Type Definitions
   - Smart Contracts
   - Library Functions

## Color Coding:
- Pink: Pages
- Blue: Components
- Green: Services
- Red: Data/Type definitions

## How to Use:
1. Copy the Mermaid diagram code
2. Import into Figma or any Mermaid-compatible tool
3. Customize colors and styling as needed
4. Add additional details or modify relationships as required 