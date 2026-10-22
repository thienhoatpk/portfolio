/**
 * Central Portfolio Data Store
 * All project, architecture, constellation, timeline, and blog information.
 * Uses verified engineering context with clearly marked, easy-to-configure placeholders.
 */

export const CONFIG = {
  name: "NTH",
  handle: "thienhoa",
  title: "Senior Backend & Cloud Systems Engineer",
  tagline: "Architecting high-throughput distributed systems, resilient cloud infrastructure, and low-latency microservices.",
  bio: "Software engineer specialized in backend architecture, concurrent systems (Go, Node.js), event-driven microservices, and cloud-native infrastructure. Passionate about developer tooling, API design, and telemetry.",
  status: "ONLINE // ACCEPTING SELECT ARCHITECTURAL INQUIRIES",
  location: "Vietnam // Asia-East",
  githubUser: "thienhoa",
  email: "nguyenthienhoatpk@gmail.com",
  social: {
    github: "https://github.com/thienhoa",
    gitlab: "https://gitlab.com/thienhoa",
    linkedin: "https://linkedin.com/in/",
    email: "mailto:hoa@gmail.com"
  }
};

export const PROJECTS = [
  {
    id: "event-stream-engine",
    title: "ApexPulse: Distributed Event Ingestion Engine",
    category: "Distributed Systems",
    summary: "High-throughput stream processing pipeline built in Go and Kafka, achieving sub-millisecond event validation and partitioned time-series storage.",
    featured: true,
    tags: ["Go", "Apache Kafka", "Redis", "TimescaleDB", "Docker", "Prometheus"],
    githubUrl: "https://github.com/thienhoa",
    demoUrl: null,
    metrics: [
      { label: "Target Throughput", value: "50,000+ msg/s" },
      { label: "P99 Processing Latency", value: "< 2.8ms" },
      { label: "Delivery Guarantee", value: "At-Least-Once" }
    ],
    caseStudy: {
      overview: "ApexPulse was designed to process telemetry data from distributed IoT gateways and web applications, ensuring reliable stream ingestion without message loss during downstream storage spikes.",
      problem: "Traditional synchronous HTTP ingestion pipelines experienced cascading timeouts and thread exhaustion when database batch write locks occurred.",
      role: "Lead Backend Architect — Designed event schema, Kafka partition key strategy, zero-allocation Go deserializers, and buffer flush workers.",
      architecture: "Stateless Go ingestion nodes receive binary payloads -> buffer in ring buffers -> emit to Kafka partitioned topics -> dedicated consumer groups batch-insert to TimescaleDB with Redis caching for hot counter lookups.",
      decisions: [
        "Chose zero-allocation protobuf encoding over JSON to decrease garbage collector pauses under heavy ingest loads.",
        "Implemented distributed ring-buffer backpressure to protect memory when Kafka broker acknowledgment times fluctuate."
      ],
      challenges: [
        "Head-of-line blocking in consumer workers was solved by implementing dynamic partition reassignment and asynchronous non-blocking worker pools."
      ],
      results: "Sustained smooth stream ingestion with zero packet loss during simulated broker node failover and 3x burst traffic spikes.",
      technologies: ["Go (Golang)", "Kafka", "Protobuf", "Redis", "TimescaleDB", "Prometheus", "Grafana", "Docker"]
    }
  },
  {
    id: "cloud-rag-orchestrator",
    title: "NeuroMesh: Cloud-Native Semantic Search & RAG Service",
    category: "Cloud & AI",
    summary: "Scalable Retrieval-Augmented Generation (RAG) backend utilizing vector embeddings, hybrid semantic-keyword ranking, and streaming token responses.",
    featured: true,
    tags: ["Python", "Go", "Qdrant", "PostgreSQL", "FastAPI", "OpenAI / Claude API", "Docker"],
    githubUrl: "https://github.com/thienhoa",
    demoUrl: null,
    metrics: [
      { label: "Vector Search P95", value: "< 14ms" },
      { label: "Embedding Cache Hit", value: "78%" },
      { label: "Document Ingestion", value: "Parallel Chunking" }
    ],
    caseStudy: {
      overview: "NeuroMesh connects enterprise knowledge repositories with generative LLM inference, providing context-grounded citations with strict tenant isolation.",
      problem: "Standard RAG implementations suffered from high retrieval latency, duplicate embedding calls, and hallucination when context windows were saturated.",
      role: "System Designer & Core Developer — Architected hybrid vector-sparse indexing, embedding deduplication cache, and streaming response proxy.",
      architecture: "FastAPI / Go gateway -> Redis embedding cache -> Qdrant HNSW vector store + PostgreSQL full-text search (RRF ranking) -> LLM streaming handler via Server-Sent Events (SSE).",
      decisions: [
        "Used Reciprocal Rank Fusion (RRF) to merge vector distance results with BM25 keyword matching for superior retrieval precision on technical jargon.",
        "Employed Redis semantic caching to serve identical query embeddings instantaneously."
      ],
      challenges: [
        "Handling massive PDF/Markdown document ingestion without blocking user queries; resolved via Celery/RabbitMQ asynchronous chunking workers."
      ],
      results: "Delivered accurate responses with verifiable source citations while reducing embedding API billing by over 60%.",
      technologies: ["Python", "Go", "Qdrant Vector DB", "PostgreSQL pgvector", "Redis", "Docker", "SSE"]
    }
  },
  {
    id: "distributed-cache-proxy",
    title: "KryptonCache: Consistent-Hashing Distributed Memory Proxy",
    category: "Full Stack",
    summary: "Lightweight, resilient caching gateway featuring virtual node consistent hashing, circuit breaking, and active replica failover.",
    featured: false,
    tags: ["Go", "gRPC", "Redis Cluster", "etcd", "Linux cgroups"],
    githubUrl: "https://github.com/thienhoa",
    demoUrl: null,
    metrics: [
      { label: "Hash Ring Distribution", value: "100 Virtual Nodes" },
      { label: "Failover Time", value: "< 250ms" },
      { label: "Protocol", value: "RESP / gRPC" }
    ],
    caseStudy: {
      overview: "A specialized reverse-proxy layer placed in front of sharded caching nodes to maintain balanced key distribution and automated traffic rerouting.",
      problem: "Node crashes in redis cache clusters caused cache stamps and immediate cascading overload on primary relational databases.",
      role: "Sole Developer — Implemented virtual node hashing ring, active health heartbeats with etcd, and circuit breaker patterns.",
      architecture: "Client apps communicate via standard Redis RESP or gRPC -> Proxy evaluates hash ring -> routes to active shard -> on shard timeout, trips circuit and returns grace fallback.",
      decisions: [
        "Implemented ketama-style consistent hashing with 100 virtual nodes per physical shard to minimize key relocation to under 1/N when nodes scale."
      ],
      challenges: [
        "Thundering herd problem during key expiration; mitigated using probabilistic early expiration (XFetch algorithm)."
      ],
      results: "Maintained 99.99% availability during simulated network partition and zero cache avalanche downstream.",
      technologies: ["Go", "Consistent Hashing", "gRPC", "etcd", "Redis", "Docker"]
    }
  },
  {
    id: "devops-telemetry-hub",
    title: "AegisMetrics: Cloud Telemetry & Alerting Daemon",
    category: "Cloud & AI",
    summary: "Resource-efficient agent collecting host metrics, container stats (cgroups v2), and network socket health with eBPF hooks.",
    featured: false,
    tags: ["Go", "eBPF", "Prometheus", "OpenTelemetry", "Linux"],
    githubUrl: "https://github.com/thienhoa",
    demoUrl: null,
    metrics: [
      { label: "Agent Memory Footprint", value: "< 18MB" },
      { label: "Sampling Interval", value: "1 second" },
      { label: "CPU Usage", value: "< 0.8%" }
    ],
    caseStudy: {
      overview: "A low-overhead telemetry daemon deployed on bare-metal and container hosts to export OpenTelemetry-compliant metrics to centralized monitoring stacks.",
      problem: "Heavyweight monitoring agents consumed noticeable CPU and memory overhead on constrained edge worker nodes.",
      role: "Systems Programmer — Implemented Linux procfs/cgroup readers and eBPF socket lifecycle monitors in Go.",
      architecture: "eBPF tracepoint probe -> ringbuffer transfer to userspace Go daemon -> Prometheus metric exposition endpoint (`/metrics`) and OTLP gRPC stream.",
      decisions: [
        "Avoided fork/exec command invocations entirely, reading directly from `/proc` and kernel ring buffers to keep CPU impact under 1%."
      ],
      challenges: [
        "Ensuring compatibility across diverse Linux kernel versions (4.18 through 6.x); implemented kernel BTF (BPF Type Format) support."
      ],
      results: "Stable continuous deployment across cluster nodes with minimal CPU and memory overhead.",
      technologies: ["Go", "Linux eBPF", "OpenTelemetry", "Prometheus", "Grafana"]
    }
  }
];

export const ARCHITECTURE_SYSTEMS = [
  {
    id: "apexpulse-stream-engine",
    projectId: "apexpulse-stream-engine",
    name: "ApexPulse: Distributed Ingestion & Stream Processing",
    description: "Multi-tier architecture separating ingest gateways, partitioned event queues, hot cache layers, and analytical time-series databases.",
    subsystems: ["Ingestion", "Messaging", "Storage", "Observability"],
    nodes: [
      {
        id: "client-edge",
        x: 60,
        y: 190,
        label: "Client / Edge Gateways",
        category: "Client / Frontend",
        status: "Active",
        protocol: "HTTPS / WSS",
        description: "IoT devices, mobile clients, and web hooks transmitting batched JSON/Protobuf telemetry events.",
        tech: ["HTTP/2", "TLS 1.3", "Protobuf"],
        connections: ["api-gateway"],
        details: "Terminates mTLS and routes through geographic edge proxies to ensure minimal network roundtrip."
      },
      {
        id: "api-gateway",
        x: 220,
        y: 190,
        label: "API Gateway & Auth",
        category: "API Gateway",
        status: "Active",
        protocol: "HTTP/REST & gRPC",
        description: "Stateless edge ingress handling token verification, rate limiting, and request validation.",
        tech: ["Go", "Envoy Proxy", "JWT / HMAC"],
        connections: ["buffer-service", "cache-redis"],
        details: "Enforces token-bucket rate limiting (10k req/s per IP subnet) and verifies cryptographically signed payloads."
      },
      {
        id: "cache-redis",
        x: 220,
        y: 350,
        label: "Redis L1 Hot Cache",
        category: "Cache",
        status: "Active",
        protocol: "RESP3",
        description: "In-memory key-value cluster storing client session metadata, active device registries, and rate-limit counters.",
        tech: ["Redis 7.2", "Cluster Mode", "AOF persistence"],
        connections: ["api-gateway", "buffer-service"],
        details: "Sub-millisecond lookup latency. Serves authorization caches with 99.4% hit ratio."
      },
      {
        id: "buffer-service",
        x: 380,
        y: 190,
        label: "Stream Buffer Service",
        category: "Backend Service",
        status: "Active",
        protocol: "TCP / Binary",
        description: "Stateless Go service implementing internal zero-allocation memory ring buffers to smooth traffic bursts.",
        tech: ["Go", "Ring Buffers", "Sync.Pool"],
        connections: ["kafka-cluster"],
        details: "Absorbs burst traffic spikes and batches records before publishing to Kafka, minimizing network syscall overhead."
      },
      {
        id: "kafka-cluster",
        x: 540,
        y: 190,
        label: "Kafka Message Broker",
        category: "Message Queue",
        status: "Active",
        protocol: "Kafka Protocol",
        description: "Fault-tolerant distributed log partitioned by device ID to guarantee strict in-order message delivery.",
        tech: ["Apache Kafka", "KRaft Mode", "3x Replicas"],
        connections: ["consumer-worker", "stream-analytics"],
        details: "Configured with `min.insync.replicas=2` and LZ4 compression, providing sustained throughput up to 100k msg/sec."
      },
      {
        id: "consumer-worker",
        x: 700,
        y: 110,
        label: "Batch Persist Workers",
        category: "Backend Service",
        status: "Active",
        protocol: "Internal gRPC",
        description: "Horizontal consumer group pooling messages into optimized bulk SQL copy operations.",
        tech: ["Go Worker Pool", "pgx batching"],
        connections: ["db-timescale"],
        details: "Consumes from Kafka partitions with manual offset commit only after successful database transaction completion."
      },
      {
        id: "db-timescale",
        x: 870,
        y: 110,
        label: "TimescaleDB Time-Series",
        category: "Database",
        status: "Active",
        protocol: "PostgreSQL Wire",
        description: "Relational database with automated time-based hypertable chunking and columnar compression.",
        tech: ["TimescaleDB", "PostgreSQL 16", "NVMe RAID10"],
        connections: [],
        details: "Compresses chunks older than 7 days by 85%, retaining raw granular data for fast analytical queries."
      },
      {
        id: "stream-analytics",
        x: 700,
        y: 280,
        label: "Real-time AI / Anomaly Detector",
        category: "AI Service",
        status: "Active",
        protocol: "gRPC Streaming",
        description: "Analyzes telemetry sliding windows for threshold violations, outlier spikes, and pattern drift.",
        tech: ["Python / ONNX", "Isolation Forest", "FastAPI"],
        connections: ["alert-hub"],
        details: "Evaluates sliding window statistics in under 8ms and fires events to alerting webhooks when anomalies are detected."
      },
      {
        id: "alert-hub",
        x: 870,
        y: 280,
        label: "Notification & Webhooks",
        category: "External Integration",
        status: "Active",
        protocol: "Webhooks / Slack API",
        description: "Dispatches critical operational alerts to Slack, PagerDuty, and email escalation channels.",
        tech: ["Webhook Queue", "Retry Backoff"],
        connections: [],
        details: "Implements exponential backoff with jitter to guarantee alert delivery without flooding downstream endpoints."
      }
    ]
  },
  {
    id: "cloud-rag-orchestrator",
    projectId: "cloud-rag-orchestrator",
    name: "NeuroMesh: Cloud-Native Semantic Search & RAG Service",
    description: "Hybrid vector-keyword indexing pipeline with embedding deduplication cache and low-latency streaming token responses.",
    subsystems: ["Ingress & Auth", "Caching & Chunking", "Vector Search", "LLM Generation"],
    nodes: [
      {
        id: "client-query",
        x: 60,
        y: 190,
        label: "Client Apps / Web SDK",
        category: "Client / Frontend",
        status: "Active",
        protocol: "HTTPS / REST",
        description: "Enterprise web consoles and API clients dispatching natural-language search and RAG prompts.",
        tech: ["TypeScript", "REST", "SSE"],
        connections: ["fastapi-gateway"],
        details: "Maintains persistent HTTP/2 connection for Server-Sent Events token stream."
      },
      {
        id: "fastapi-gateway",
        x: 220,
        y: 190,
        label: "FastAPI / Go Gateway",
        category: "API Gateway",
        status: "Active",
        protocol: "HTTP/2",
        description: "High-concurrency API gateway performing OAuth2 validation, prompt normalization, and rate limiting.",
        tech: ["FastAPI", "Go Gateway", "Pydantic"],
        connections: ["semantic-cache", "rag-orchestrator"],
        details: "Calculates query hash signatures for sub-millisecond semantic cache lookups."
      },
      {
        id: "semantic-cache",
        x: 220,
        y: 350,
        label: "Redis Semantic Cache",
        category: "Cache",
        status: "Active",
        protocol: "RESP3",
        description: "Vector embedding cache returning instant matches for previously computed user queries.",
        tech: ["Redis 7.2", "Cosine Sim", "TTL 24h"],
        connections: ["rag-orchestrator"],
        details: "Achieves 78% cache hit ratio on repeated queries, eliminating redundant LLM embedding expenses."
      },
      {
        id: "doc-ingest-worker",
        x: 390,
        y: 60,
        label: "Async Ingest & Chunking",
        category: "Backend Service",
        status: "Active",
        protocol: "AMQP",
        description: "Background worker pool processing massive document uploads (PDF, Markdown, Docs) into chunked vectors.",
        tech: ["Celery", "RabbitMQ", "unstructured"],
        connections: ["qdrant-vector", "postgres-hybrid"],
        details: "Uses semantic recursive character splitters with 15% overlap to preserve semantic context."
      },
      {
        id: "rag-orchestrator",
        x: 430,
        y: 210,
        label: "RAG Pipeline Orchestrator",
        category: "Backend Service",
        status: "Active",
        protocol: "Internal Async",
        description: "Executes hybrid vector similarity search, BM25 keyword matching, and Reciprocal Rank Fusion (RRF).",
        tech: ["Python 3.11", "LangChain Core", "RRF"],
        connections: ["qdrant-vector", "postgres-hybrid", "llm-streamer"],
        details: "Blends dense embeddings and sparse keyword scores to rank technical jargon with high precision."
      },
      {
        id: "qdrant-vector",
        x: 650,
        y: 110,
        label: "Qdrant HNSW Vector DB",
        category: "Database",
        status: "Active",
        protocol: "gRPC",
        description: "Vector database storing 1536-dimensional OpenAI embeddings indexed with hierarchical navigable small-world graphs.",
        tech: ["Qdrant", "HNSW Index", "Cosine Sim"],
        connections: ["llm-streamer"],
        details: "P95 retrieval latency under 14ms across 1.5 million chunked document vectors."
      },
      {
        id: "postgres-hybrid",
        x: 650,
        y: 310,
        label: "PostgreSQL pgvector (RRF)",
        category: "Database",
        status: "Active",
        protocol: "PostgreSQL Wire",
        description: "Relational storage maintaining source citations, tenant access policies, and full-text inverted indexes.",
        tech: ["PostgreSQL 16", "pgvector", "BM25"],
        connections: ["llm-streamer"],
        details: "Enforces row-level tenant security so users only retrieve documents matching their role permissions."
      },
      {
        id: "llm-streamer",
        x: 870,
        y: 210,
        label: "LLM Inference & SSE Proxy",
        category: "AI Service",
        status: "Active",
        protocol: "SSE / Streaming",
        description: "Proxies prompt + grounded context to LLM foundation models and streams tokens back to the client.",
        tech: ["OpenAI / Claude API", "FastAPI SSE", "Token Buffering"],
        connections: [],
        details: "Streams initial tokens in under 220ms while validating source citations in real-time."
      }
    ]
  },
  {
    id: "distributed-cache-proxy",
    projectId: "distributed-cache-proxy",
    name: "KryptonCache: Consistent-Hashing Distributed Memory Proxy",
    description: "High-performance reverse proxy routing sharded key-value traffic with virtual node ring and zero cache avalanche.",
    subsystems: ["Client Layer", "Routing & Hashing", "Cache Cluster", "Storage Fallback"],
    nodes: [
      {
        id: "krypton-client",
        x: 60,
        y: 190,
        label: "Client Applications",
        category: "Client / Frontend",
        status: "Active",
        protocol: "TCP / RESP",
        description: "Backend microservices querying cache data using standard Redis clients without cluster-awareness overhead.",
        tech: ["Go Client", "Node.js", "Python redis-py"],
        connections: ["proxy-ingress"],
        details: "Communicates via pipelined RESP3 protocol with connection pooling."
      },
      {
        id: "proxy-ingress",
        x: 220,
        y: 190,
        label: "Krypton Proxy Gateway",
        category: "API Gateway",
        status: "Active",
        protocol: "RESP3 / gRPC",
        description: "Epoll-based non-blocking Go gateway decoding incoming requests and mapping key hashes.",
        tech: ["Go", "epoll / netpoll", "Zero-alloc parser"],
        connections: ["hash-ring", "circuit-breaker"],
        details: "Handles 150k concurrent requests per core with zero GC heap allocations on hot paths."
      },
      {
        id: "etcd-registry",
        x: 220,
        y: 350,
        label: "etcd Topology Registry",
        category: "Backend Service",
        status: "Active",
        protocol: "Raft / gRPC",
        description: "Distributed consensus store maintaining active cache shard heartbeats and topology configuration.",
        tech: ["etcd v3", "Raft Consensus", "Watch API"],
        connections: ["hash-ring"],
        details: "Notifies proxies of node failure in under 250ms via persistent gRPC watchers."
      },
      {
        id: "hash-ring",
        x: 410,
        y: 190,
        label: "Virtual Node Hash Ring",
        category: "Backend Service",
        status: "Active",
        protocol: "Memory Hashing",
        description: "Ketama-style consistent hashing ring maintaining 100 virtual nodes per physical shard.",
        tech: ["Ketama Hashing", "Murmur3", "100 VNodes"],
        connections: ["shard-alpha", "shard-beta", "shard-gamma"],
        details: "Limits key redistribution to less than 1/N when shards are added or removed dynamically."
      },
      {
        id: "shard-alpha",
        x: 640,
        y: 80,
        label: "Cache Shard #01",
        category: "Cache",
        status: "Active",
        protocol: "RESP3",
        description: "In-memory partition storing keys in hash range [0x0000 - 0x5555] with active async replication.",
        tech: ["Redis 7.2", "AOF everysec", "Master-Replica"],
        connections: ["circuit-breaker"],
        details: "Sub-millisecond read latency with automatic replica promotion on master failure."
      },
      {
        id: "shard-beta",
        x: 640,
        y: 200,
        label: "Cache Shard #02",
        category: "Cache",
        status: "Active",
        protocol: "RESP3",
        description: "In-memory partition storing keys in hash range [0x5556 - 0xAAAA] with active async replication.",
        tech: ["Redis 7.2", "AOF everysec", "Master-Replica"],
        connections: ["circuit-breaker"],
        details: "Operates with 99.99% read availability under heavy synthetic load tests."
      },
      {
        id: "shard-gamma",
        x: 640,
        y: 320,
        label: "Cache Shard #03",
        category: "Cache",
        status: "Active",
        protocol: "RESP3",
        description: "In-memory partition storing keys in hash range [0xAAAB - 0xFFFF] with active async replication.",
        tech: ["Redis 7.2", "AOF everysec", "Master-Replica"],
        connections: ["circuit-breaker"],
        details: "Balanced memory utilization within ±2.4% across all physical nodes."
      },
      {
        id: "circuit-breaker",
        x: 840,
        y: 150,
        label: "Circuit Breaker & Fallback",
        category: "External Integration",
        status: "Active",
        protocol: "Internal",
        description: "Monitors shard error rates and trips circuit when timeouts exceed threshold, preventing avalanche.",
        tech: ["Go CircuitBreaker", "XFetch Algorithm"],
        connections: ["primary-db"],
        details: "Uses probabilistic early expiration (XFetch) to eliminate thundering herd cache stampedes."
      },
      {
        id: "primary-db",
        x: 840,
        y: 320,
        label: "Primary Database Cluster",
        category: "Database",
        status: "Active",
        protocol: "PostgreSQL Wire",
        description: "Underlying system of record protected by the proxy from unthrottled cache-miss bursts.",
        tech: ["PostgreSQL 16", "Read Replicas", "PgBouncer"],
        connections: [],
        details: "Protected from connection pool exhaustion during sudden node crash failover cycles."
      }
    ]
  },
  {
    id: "devops-telemetry-hub",
    projectId: "devops-telemetry-hub",
    name: "AegisMetrics: Cloud Telemetry & Alerting Daemon",
    description: "Low-overhead Linux host and container metric collection daemon powered by eBPF probes and OTLP streaming.",
    subsystems: ["Host Probes", "Ingest Engine", "Exposition", "Alerting & UI"],
    nodes: [
      {
        id: "kernel-ebpf",
        x: 60,
        y: 120,
        label: "Linux Kernel eBPF Probes",
        category: "Backend Service",
        status: "Active",
        protocol: "BPF Syscall",
        description: "Custom eBPF tracepoint probes hooked into socket lifecycles, TCP retransmissions, and syscall latencies.",
        tech: ["eBPF", "kprobes", "tracepoints", "CO-RE"],
        connections: ["kernel-ringbuf"],
        details: "Zero userspace context-switch overhead, executing in-kernel verification safely."
      },
      {
        id: "cgroup-v2",
        x: 60,
        y: 280,
        label: "cgroups v2 & Procfs Monitor",
        category: "Backend Service",
        status: "Active",
        protocol: "VFS / sysfs",
        description: "Reads container memory limits, CPU throttle statistics, and PSI (Pressure Stall Information).",
        tech: ["cgroups v2", "/proc virtual fs", "sysfs"],
        connections: ["kernel-ringbuf"],
        details: "Samples container pressure stall metrics at 1-second intervals with less than 0.8% CPU usage."
      },
      {
        id: "kernel-ringbuf",
        x: 250,
        y: 200,
        label: "Zero-Alloc Kernel Ringbuffer",
        category: "Message Queue",
        status: "Active",
        protocol: "mmap",
        description: "Shared memory ring buffer transferring high-frequency kernel telemetry to userspace without syscall copies.",
        tech: ["BPF Ringbuffer", "Perf Buffer", "mmap"],
        connections: ["aegis-daemon"],
        details: "Absorbs up to 500,000 events/sec per host without kernel packet drops."
      },
      {
        id: "aegis-daemon",
        x: 450,
        y: 200,
        label: "Aegis Userspace Go Daemon",
        category: "API Gateway",
        status: "Active",
        protocol: "Userspace Go",
        description: "Single-binary compiled Go daemon aggregating metrics, evaluating anomaly thresholds, and encoding OTLP.",
        tech: ["Go 1.22", "OTel Go SDK", "< 18MB RAM"],
        connections: ["prom-endpoint", "otlp-grpc"],
        details: "Static binary with zero external shared library dependencies, deployable across any Linux kernel 4.18+."
      },
      {
        id: "prom-endpoint",
        x: 660,
        y: 110,
        label: "Prometheus `/metrics` Scraper",
        category: "External Integration",
        status: "Active",
        protocol: "HTTP/1.1",
        description: "Exposes scrape targets formatted with standard OpenMetrics syntax for pulling by Prometheus server.",
        tech: ["Prometheus Exposition", "OpenMetrics"],
        connections: ["grafana-dashboards"],
        details: "Exports over 200 custom host and socket health counters in sub-millisecond response time."
      },
      {
        id: "otlp-grpc",
        x: 660,
        y: 290,
        label: "OTLP gRPC Exporter",
        category: "External Integration",
        status: "Active",
        protocol: "gRPC / Protobuf",
        description: "Streams batched metric deltas and trace events to centralized OpenTelemetry collectors.",
        tech: ["OpenTelemetry Protocol", "Protobuf over HTTP/2"],
        connections: ["alertmanager-hub"],
        details: "Implements exponential retry backoff and in-memory spooling during network disconnects."
      },
      {
        id: "grafana-dashboards",
        x: 870,
        y: 110,
        label: "Grafana Visualization",
        category: "Client / Frontend",
        status: "Active",
        protocol: "HTTPS",
        description: "Real-time production dashboards displaying CPU/Memory pressure, network socket saturation, and p99 latencies.",
        tech: ["Grafana 10", "PromQL", "Custom Dashboards"],
        connections: [],
        details: "Configured with pre-built alerting panels and automated root-cause drilldowns."
      },
      {
        id: "alertmanager-hub",
        x: 870,
        y: 290,
        label: "Alertmanager & Slack Pager",
        category: "External Integration",
        status: "Active",
        protocol: "Webhooks",
        description: "Evaluates multi-cluster alert rules and routes actionable incidents to Slack, Opsgenie, and PagerDuty.",
        tech: ["Alertmanager", "Slack Webhook", "PagerDuty API"],
        connections: [],
        details: "Deduplicates flapping alerts and groups incidents by Kubernetes namespace or node cluster."
      }
    ]
  }
];

import techStackConfig from './tech-stack.json';
import workExperienceRaw from './work-experience.json';

export const CONSTELLATION_NODES = techStackConfig.nodes;
export const TECH_STACK_CONFIG = techStackConfig;

// Relational Primary Key Index Map for Tech Stack: Map<id, TechNode>
export const TECH_STACK_MAP = new Map();
(techStackConfig.nodes || []).forEach(node => {
  TECH_STACK_MAP.set(node.id, node);
  if (node.slug) TECH_STACK_MAP.set(node.slug, node);
});

// Perform Relational Join (work_experience -> tech_stack using foreign keys tech_stack_ids)
export const WORK_EXPERIENCES = workExperienceRaw.map(exp => {
  const joinedTechs = (exp.tech_stack_ids || []).map(techId => {
    const techRecord = TECH_STACK_MAP.get(techId);
    return techRecord ? {
      id: techRecord.id,
      name: techRecord.name,
      slug: techRecord.slug,
      icon: techRecord.icon || techRecord.slug,
      category: techRecord.category,
      role: techRecord.role
    } : {
      id: techId,
      name: `Tech #${techId}`,
      slug: String(techId),
      icon: 'default',
      category: 'Tools',
      role: ''
    };
  });

  return {
    id: exp.id,
    company: exp.company,
    role: exp.role,
    period: exp.period,
    dateStart: exp.date_start,
    dateEnd: exp.date_end,
    isCurrent: exp.is_current,
    location: exp.location,
    description: exp.description,
    detailOverview: exp.detail_overview,
    achievements: exp.achievements,
    techStackIds: exp.tech_stack_ids,
    technologies: joinedTechs,
    thumbnail: exp.thumbnail,
    logoType: exp.logo_type,
    color: exp.color,
    projectId: exp.project_id
  };
});

export const CAREER_STATS = {
  years: "4+",
  yearsDetail: "4 years",
  companies: 5,
  projects: 6,
  technologies: "16+",
  quote: "Không chỉ viết code, mình đang xây dựng những điều có ý nghĩa.",
  author: "Hòa Nguyễn Thiện"
};

export const TIMELINE_MILESTONES = WORK_EXPERIENCES;

export const BLOG_ARTICLES = [
  {
    id: "zero-allocation-go-streaming",
    slug: "zero-allocation-go-streaming",
    title: "Zero-Allocation Stream Processing in Go: Taming the Garbage Collector",
    category: "Go & Backend",
    date: "2024-08-15",
    readTime: "7 min read",
    excerpt: "How we eliminated GC latency spikes in our high-throughput Kafka ingestion service by utilizing sync.Pool, byte slice recycling, and custom binary parsers.",
    tags: ["Go", "Concurrency", "Performance", "Garbage Collection"],
    content: `
### The Latency Problem Under Sustained Load

When building ingestion microservices that process tens of thousands of telemetry events per second, standard JSON unmarshaling and struct allocations can rapidly overwhelm the Go runtime garbage collector (GC). In our initial benchmarks, while average latency remained under 3ms, P99.9 latency regularly spiked to 45ms during mark-and-sweep phases.

\`\`\`go
// Inefficient pattern: creates heap allocations on every incoming message
func handleMessage(data []byte) (*Event, error) {
    var evt Event
    if err := json.Unmarshal(data, &evt); err != nil {
        return nil, err
    }
    return &evt, nil
}
\`\`\`

### Strategy 1: Reusable Object Pools with sync.Pool

The standard library \`sync.Pool\` provides a thread-safe way to reuse allocated memory buffers across concurrent goroutines without triggering GC sweeps:

\`\`\`go
var eventPool = sync.Pool{
    New: func() any {
        return &Event{
            Payload: make([]byte, 0, 1024),
        }
    },
}

func ProcessEvent(raw []byte) error {
    evt := eventPool.Get().(*Event)
    defer func() {
        evt.Reset()
        eventPool.Put(evt)
    }()

    return evt.FastDecode(raw)
}
\`\`\`

### Strategy 2: Pre-Sizing Byte Slices and Zero-Copy Conversions

Whenever string conversion is required strictly for read-only map lookups or hash ring evaluations, avoid copying byte slices into heap-allocated strings:

\`\`\`go
// Zero-allocation string view over a byte slice for read-only maps
func StringView(b []byte) string {
    return unsafe.String(unsafe.SliceData(b), len(b))
}
\`\`\`

### Results & Metrics

By combining \`sync.Pool\` with custom Protobuf decoding:
1. Heap allocations dropped from **1,420 bytes/op** to **0 bytes/op** on the hot processing path.
2. P99 latency smoothed to a flat **1.8ms**, eliminating periodic GC stutter.
    `
  },
  {
    id: "consistent-hashing-distributed-cache",
    slug: "consistent-hashing-distributed-cache",
    title: "Designing a Fault-Tolerant Cache Proxy with Consistent Hashing",
    category: "Distributed Systems",
    date: "2024-05-10",
    readTime: "9 min read",
    excerpt: "Deep dive into virtual node distribution, ring balancing, and avoiding cache stampedes when redis cluster nodes drop or fail over.",
    tags: ["Distributed Systems", "Caching", "Algorithms", "Redis"],
    content: `
### Why Traditional Modulo Hashing Breaks Clusters

In simple sharding, keys are routed via \`hash(key) % N\`. However, when node count $N$ changes due to failure or autoscaling, almost every key hashes to a different node:

$$\\text{Relocated Keys} = \\frac{N}{N+1} \\approx 100\\%$$

This instantly causes a catastrophic **Cache Avalanche**, hammering underlying relational databases with uncached queries.

### The Virtual Node Ring

Consistent hashing maps both servers and cache keys to points on a 32-bit or 64-bit circular integer ring (e.g., $0$ to $2^{32}-1$). To prevent uneven key distribution (\"hot spots\"), each physical node is replicated as multiple **virtual nodes** around the circle:

\`\`\`go
type HashRing struct {
    virtualNodes int
    ring         []uint32
    nodeMap      map[uint32]string
    mu           sync.RWMutex
}

func (h *HashRing) AddNode(node string) {
    h.mu.Lock()
    defer h.mu.Unlock()
    for i := 0; i < h.virtualNodes; i++ {
        vKey := fmt.Sprintf("%s#vnode-%d", node, i)
        hash := crc32.ChecksumIEEE([]byte(vKey))
        h.ring = append(h.ring, hash)
        h.nodeMap[hash] = node
    }
    sort.Slice(h.ring, func(i, j int) bool { return h.ring[i] < h.ring[j] })
}
\`\`\`

### Mitigating Stampedes with Probabilistic Early Expiration

Even with consistent hashing, keys expiring simultaneously can cause thundering herds. We implemented the **XFetch algorithm**:

$$-\\beta \\times \\delta \\times \\ln(rand()) > \\text{TTL}$$

Workers probabilistically refresh the cache entry before it actually expires, ensuring 100% cache warmth under high read concurrency.
    `
  },
  {
    id: "hybrid-rag-retrieval-qdrant",
    slug: "hybrid-rag-retrieval-qdrant",
    title: "Hybrid Search in Production: Merging Dense Vectors with Sparse Lexical Ranking",
    category: "AI & Search",
    date: "2024-02-28",
    readTime: "8 min read",
    excerpt: "Why vector search alone fails on technical code identifiers, and how Reciprocal Rank Fusion (RRF) delivers bulletproof retrieval for LLM context.",
    tags: ["AI / RAG", "Vector Search", "Qdrant", "PostgreSQL"],
    content: `
### The Vector Blindspot: Exact Keywords and Symbol Names

Dense embedding models (such as \`text-embedding-3-small\`) excel at semantic generalization. However, they frequently fail when users search for exact technical terms, such as error codes (\`ERR_CONNECTION_RESET\`), UUIDs, or specific function names (\`sync.WaitGroup.Add\`).

### Reciprocal Rank Fusion (RRF) Architecture

Instead of relying solely on vector similarity, we execute two searches in parallel:
1. **Dense Vector Search:** High-recall cosine similarity via Qdrant HNSW.
2. **Sparse Lexical Search:** BM25 full-text indexing via PostgreSQL or OpenSearch.

We combine the rank positions using Reciprocal Rank Fusion:

$$RRF(d) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}$$

Where $k = 60$ is a smoothing constant, and $r_m(d)$ is the document's rank in ranking method $m$.

\`\`\`python
def reciprocal_rank_fusion(dense_ranks: list, sparse_ranks: list, k: int = 60) -> list:
    scores = {}
    for rank, doc_id in enumerate(dense_ranks, start=1):
        scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
    for rank, doc_id in enumerate(sparse_ranks, start=1):
        scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)

    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
\`\`\`

### Production Takeaways

- Token usage in LLM context windows dropped by 35% because retrieved snippets were significantly more relevant.
- Halved user bug reports regarding missed exact code matches.
    `
  }
];
