+++
date = "{{ .Date | time.Format "2006-01-02" }}"
draft = true
tags = []
title = "{{ replace .File.ContentBaseName '-' ' ' }}"
+++
