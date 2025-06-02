# BuddyFi Application Architecture

```mermaid
graph TB
    %% Main Application Structure
    subgraph "Frontend Application"
        App[App Root]
        Layout[Layout Component]
        
        %% Pages
        subgraph "Pages"
            Home[Home Page]
            Auth[Authentication]
            Dashboard[Dashboard]
            Discover[Discover]
            Profile[Profile]
            Workspace[Workspace]
            Payment[Payment]
            Matches[Matches]
            Admin[Admin Dashboard]
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
        
        %% UI Components
        subgraph "UI Components"
            UI[UI Library]
            Buttons[Buttons]
            Forms[Forms]
            Modals[Modals]
            Cards[Cards]
        end
        
        %% Services
        subgraph "Services"
            ProfileService[Profile Service]
            AuthService[Auth Service]
            PaymentService[Payment Service]
        end
        
        %% Context
        subgraph "Context"
            SubscriptionContext[Subscription Context]
            WalletProvider[Wallet Provider]
        end
        
        %% Data Flow
        App --> Layout
        Layout --> Nav
        Layout --> Footer
        
        %% Page Connections
        App --> Home
        App --> Auth
        App --> Dashboard
        App --> Discover
        App --> Profile
        App --> Workspace
        App --> Payment
        App --> Matches
        App --> Admin
        
        %% Component Usage
        Profile --> ProfileForm
        Profile --> ProfileDisplay
        Discover --> UserCard
        Workspace --> MessageChat
        Payment --> SubscriptionCard
        
        %% Service Integration
        ProfileService --> Profile
        AuthService --> Auth
        PaymentService --> Payment
        
        %% Context Integration
        SubscriptionContext --> SubscriptionCard
        WalletProvider --> Payment
    end
    
    %% Styling
    classDef page fill:#f9f,stroke:#333,stroke-width:2px
    classDef component fill:#bbf,stroke:#333,stroke-width:2px
    classDef service fill:#bfb,stroke:#333,stroke-width:2px
    classDef context fill:#fbb,stroke:#333,stroke-width:2px
    
    class Home,Auth,Dashboard,Discover,Profile,Workspace,Payment,Matches,Admin page
    class Nav,Footer,UserCard,ProfileForm,ProfileDisplay,MessageChat,SubscriptionCard,DevIcon,RoadmapTimeline,FeatureCard,TestimonialCarousel component
    class ProfileService,AuthService,PaymentService service
    class SubscriptionContext,WalletProvider context
```

## Key Features and Data Flow

1. **Authentication Flow**
   - User authentication handled through Auth Service
   - Protected routes and session management
   - Wallet integration for Web3 features

2. **Profile Management**
   - Profile creation and editing
   - Skill tags and user information
   - Profile display and matching

3. **Workspace Features**
   - Real-time messaging
   - Collaboration tools
   - Project management

4. **Payment Integration**
   - Subscription management
   - Payment processing
   - Trial period handling

5. **Discovery and Matching**
   - User discovery
   - Matching algorithm
   - Connection management

## Component Hierarchy

1. **Layout Components**
   - Navbar
   - Footer
   - Global layout wrapper

2. **Feature Components**
   - User cards
   - Profile forms
   - Message chat
   - Subscription cards

3. **UI Components**
   - Reusable UI elements
   - Form components
   - Modal components
   - Card components

## Data Management

1. **Context Providers**
   - Subscription context
   - Wallet provider
   - Authentication state

2. **Services**
   - Profile service
   - Authentication service
   - Payment service

## File Structure

```
buddyfi/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Dashboard pages
│   ├── discover/          # Discovery features
│   ├── profile/           # Profile management
│   ├── workspace/         # Workspace features
│   ├── payment/           # Payment processing
│   ├── matches/           # Matching system
│   └── adminbuddy/        # Admin dashboard
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── data/            # Data display components
│   └── solana/          # Blockchain components
├── context/              # React context providers
├── services/             # API services
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript types
└── public/              # Static assets
```

This architecture diagram provides a comprehensive overview of the application structure, component relationships, and data flow. You can import this Mermaid diagram into Figma by:

1. Copy the Mermaid code
2. Use a Mermaid to SVG converter
3. Import the SVG into Figma
4. Customize the styling and layout as needed

The diagram shows the main application structure, component hierarchy, and how different parts of the application interact with each other. It's designed to be clear and organized, making it suitable for stakeholder presentations. 