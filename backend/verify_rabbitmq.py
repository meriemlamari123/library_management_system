import sys
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Add backend to path
sys.path.append(os.getcwd())

try:
    from common.rabbitmq_client import RabbitMQClient
    print("Initializing RabbitMQClient...")
    client = RabbitMQClient()
    print(f"RabbitMQ Host: {client.host}")
    print(f"RabbitMQ Port: {client.port}")
    if client.connect():
        print("✅ Successfully connected to RabbitMQ!")
        client.disconnect()
    else:
        print("❌ Failed to connect to RabbitMQ.")
except ImportError as e:
    print(f"ImportError: {e}")
except Exception as e:
    print(f"Error: {e}")
